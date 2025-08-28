import requests
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
from app.config import settings
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User
from jose import jwt
from datetime import datetime, timedelta,timezone
from app.services import get_current_user


router = APIRouter()


@router.get("/login")
def login():
    scopes = "user-read-private user-read-email user-top-read"
    state = "random_string_for_csrf"  # generate securely in production
    print("Redirect URI:", settings.SPOTIFY_REDIRECT_URI)
    query_params = urlencode({
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "scope": scopes,
        "state": state
    })
    return RedirectResponse(f"https://accounts.spotify.com/authorize?{query_params}")

@router.get("/callback")
def callback(code: str, state: str, db: Session = Depends(get_db)):
    print(f"Received code: {code}, state: {state}")
    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "client_secret": settings.SPOTIFY_CLIENT_SECRET
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post(token_url, data=payload, headers=headers)
    token_info = r.json()

    access_token = token_info.get("access_token")
    refresh_token = token_info.get("refresh_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token")

     # After getting access_token
    headers = {"Authorization": f"Bearer {access_token}"}
    user_profile = requests.get("https://api.spotify.com/v1/me", headers=headers).json()
    spotify_user_id = user_profile.get("id")
    if not spotify_user_id:
        raise HTTPException(status_code=400, detail="Failed to get Spotify user profile")

    # Store or update token in DB
    user = db.query(User).filter(User.id == spotify_user_id).first()
    if not user:
        user = User(id=spotify_user_id, access_token=access_token, refresh_token=refresh_token)
        db.add(user)
    else:
        user.access_token = access_token
        user.refresh_token = refresh_token
    db.commit()

    # Create JWT containing the user_id
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt_token = jwt.encode({"sub": spotify_user_id, "exp": expire}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return {"message": "Login successful", "access_token": jwt_token, "token_type": "bearer"}

@router.post("/logout")
def logout(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Remove Spotify tokens
    user.access_token = None
    user.refresh_token = None
    db.commit()
    return {"message": "Logged out successfully"}
