from fastapi import FastAPI

app = FastAPI()


@app.get("/{name}")
def hello(name: str = "World"):
    return f"Hello {name}!"
