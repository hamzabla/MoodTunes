import nltk
from nltk.sentiment import SentimentIntensityAnalyzer          

nltk.download("vader_lexicon")

sia = SentimentIntensityAnalyzer()

def detect_mood_from_text(text: str) -> str:
    scores = sia.polarity_scores(text)
    compound = scores["compound"]
    if compound >= 0.05:
        return "happy"
    elif compound <= -0.05:
        return "sad"
    else:
        return "neutral"
