# 🎶 MoodTunes

MoodTunes is a creative web application that connects to your **Spotify account** and suggests songs based on your **mood**.  
You type how you feel, the app processes your text using **sentiment analysis (NLTK)**, and generates a playlist tailored to your vibe.

---

## 🚀 Features
- 🔑 **Spotify Login** – Secure OAuth2 login with Spotify.
- 🧠 **Mood Detection** – Uses NLP (Natural Language Processing) to analyze text.
- 🎵 **Mood → Music** – Maps your detected mood to Spotify genres.
- 🎧 **Personalized Songs** – Fetches recommendations from Spotify with your account.

---

## 📂 Project Structure

moodtunes/
│── backend/ # FastAPI app (Python)
│ ├── app/ # services, auth, models
│ └── main.py
│── frontend/ # Vite + React frontend
│ └── src/
│── .env # Frontend environment config
│── .env.backend # Backend environment config

## ⚙️ Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/hamzabla/MoodTunes.git
cd moodtunes
```

### 2️⃣ Create a Spotify App
```bash
You’ll need a Spotify Developer account.

Go to Spotify Developer Dashboard

Create a new app

Add your Redirect URIs (see below)

Copy your Client ID and Client Secret

📖 Follow Spotify’s official docs:
👉 https://developer.spotify.com/documentation/web-api/
```

### 3️⃣ Environment Variables
```bash
🌐 Frontend (frontend/.env)

# API base URL (where FastAPI backend runs)
VITE_API_BASE_URL=http://127.0.0.1:8000

# Spotify configuration
VITE_SPOTIFY_CLIENT_ID=XXXXX
VITE_SPOTIFY_REDIRECT_URI=http://192.168.11.105:5173/  # ⚠️ must match Spotify app settings

# Development settings
VITE_NODE_ENV=development

⚡ Backend (backend/.env)

SPOTIFY_CLIENT_ID=VVVVVV
SPOTIFY_CLIENT_SECRET=XXXXXXXX
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback  # ⚠️ must match Spotify app settings

SECRET_KEY="xxx-xxx-key"   # change this in production
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
```
### 4️⃣ Run the Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
### 5️⃣ Run the Frontend (Vite + React)
```bash
We use pnpm for package management.

cd frontend
pnpm install
pnpm dev --host 192.168.11.105

🧪 Usage

Start backend + frontend.

Open http://192.168.11.105 in your browser.

Log in with Spotify.

Enter how you feel (e.g., "I feel happy and excited").

MoodTunes will detect your mood and generate a playlist 🎶.
```