from fastapi import FastAPI, Depends
from app.models import PlaylistResponse, TextRequest
from app.services import get_genres_from_mood, search_songs_by_genres, get_current_user
from app.sentiment import detect_mood_from_text
from app import auth
from app.db import Base, engine
from sqlalchemy.orm import Session
from app.models import User
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mood Playlist Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.post("/playlist", response_model=PlaylistResponse)
def generate_playlist(request: TextRequest, user: User = Depends(get_current_user)):
    mood = detect_mood_from_text(request.text)
    genres = get_genres_from_mood(mood)
    songs = search_songs_by_genres(user.access_token, genres, limit=10)
    return {
        "playlist_name": f"{mood.title()} Vibes",
        "songs": songs
    }

