from fastapi import FastAPI
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


class PolarityScores(BaseModel):
    pos: float
    compound: float
    neu: float
    neg: float


class Request(BaseModel):
    phrase: str


app = FastAPI()
analyzer = SentimentIntensityAnalyzer()


@app.post("/", response_model=PolarityScores)
def sentiment(request: Request):
    print(request)
    return analyzer.polarity_scores(request.phrase)
