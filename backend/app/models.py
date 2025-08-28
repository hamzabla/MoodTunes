from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import Column, String
from app.db import Base

class Song(BaseModel):
    title: str
    artist: str
    spotify_url: Optional[str]

class PlaylistResponse(BaseModel):
    playlist_name: str
    songs: List[Song]

class TextRequest(BaseModel):
    text: str

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # our user_id
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=True)
