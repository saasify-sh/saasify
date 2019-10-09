from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
  name: str
  price: float
  is_offer: bool = None

app = FastAPI()

@app.get("/")
def hello(name: str = "World"):
  return 'Hello ' + name + '!'

@app.post("/item")
def update_item(item: Item):
  return {"item_name": item.name}
