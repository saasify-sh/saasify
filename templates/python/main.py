from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
def hello(name: str = "World"):
  return 'Hello ' + name + '!'
