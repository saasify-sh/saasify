from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
import stylecloud


class Request(BaseModel):
    text: str
    size: int = 512
    icon_name: str ='fas fa-flag'
    palette: str = 'cartocolors.qualitative.Bold_6'
    background_color: str = "white"
    max_font_size: int = 200
    max_words: int = 2000
    stopwords: bool = True
    gradient: str = None


app = FastAPI()


@app.post(
    "/",
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "Return the JSON item or an image.",
        }
    }
)
def generate(request: Request):
    stylecloud.gen_stylecloud(**request.dict())

    return FileResponse("stylecloud.png", media_type="image/png")
