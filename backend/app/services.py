import requests
from app.config import settings
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")  # tokenUrl is just a label

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid authentication")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def get_genres_from_mood(mood: str) -> list[str]:
    mood_to_genres = {
        "happy": ["pop", "dance", "happy"],
        "sad": ["acoustic", "sad", "piano"],
        "neutral": ["chill", "ambient", "indie"],
    }
    return mood_to_genres.get(mood.lower(), ["pop"])

def search_songs_by_genres(token, genres, limit=10):
    headers = {"Authorization": f"Bearer {token}"}
    genre_query = " ".join(genres)
    url = f"https://api.spotify.com/v1/search?q={genre_query}&type=track&limit={limit}"
    r = requests.get(url, headers=headers)

    if r.status_code != 200:
        raise HTTPException(
            status_code=r.status_code,
            detail=f"Spotify API error: {r.json().get('error', {}).get('message', 'Unknown error')}"
        )

    data = r.json()
    items = data.get("tracks", {}).get("items", [])
    return [
        {
            "title": track["name"],
            "artist": track["artists"][0]["name"],
            "spotify_url": track["external_urls"]["spotify"]
        }
        for track in items
    ]


