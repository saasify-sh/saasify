from fastapi import FastAPI
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


class PolarityScores(BaseModel):
    pos: float
    compound: float
    neu: float
    neg: float


app = FastAPI()
analyzer = SentimentIntensityAnalyzer()


@app.get("/", response_model=PolarityScores)
def sentiment(phrase: str):
    return analyzer.polarity_scores(phrase)
