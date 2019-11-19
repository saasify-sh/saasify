import os
import pprint

from dotenv import load_dotenv
from enum import Enum
from fastapi import FastAPI
from pydantic import BaseModel, Schema
from pydantic.color import Color
from starlette.responses import FileResponse
from stylecloud import stylecloud as sc
from typing import Optional
from wordcloud import WordCloud

from diffbot import article
from fontawesome import FontAwesomeIcon
from palettes import Palette


class Gradient(str, Enum):
    none = "none"
    horizontal = "horizontal"
    vertical = "vertical"


class StyleCloudRequest(BaseModel):
    url: str = Schema(None, description="URL of webpage to extract text")
    text: str = Schema(None, description="Source text")
    size: int = Schema(512, description="Output width and height in pixels")
    icon_name: FontAwesomeIcon = Schema(
        "fas fa-grin",
        description="[Font Awesome](https://fontawesome.com/icons?d=gallery&m=free) icon mask",
        alias="icon",
    )
    palette: Palette = Schema(
        "cartocolors.qualitative.Bold_6",
        description="Color palette to use from [palettable](https://jiffyclub.github.io/palettable/)",
    )
    background_color: Color = Color("white")
    max_font_size: int = 200
    max_words: int = Schema(
        2000, description="Maximum number of words to include in the stylecloud", gt=0
    )
    stopwords: bool = Schema(True, description="Boolean to filter out common stopwords")
    gradient: Gradient = Schema(
        "horizontal",
        description="Direction of gradient. Set to 'none' to disable gradient.",
    )


load_dotenv()

app = FastAPI()

# ensure that all result images are cached aggressively
headers = {
    "Cache-Control": "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
}

responses = {
    200: {
        "content": {"image/png": {}},
        "description": "Return a stylecloud image of the input text.",
    }
}

DIFFBOT_TOKEN = os.getenv("DIFFBOT_TOKEN")
OUTPUT_NAME = "/tmp/out.png"


def require_diffbot():
    if DIFFBOT_TOKEN is None:
        raise Exception("url support requires a valid diffbot token")


@app.post(
    "/stylecloud",
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "Return a stylecloud image of the input text.",
        }
    },
)
def stylecloud(request: StyleCloudRequest):
    params = request.dict()
    url = params.pop("url", None)
    text = params.pop("text", None)
    background_color = params.pop("background_color", None)
    gradient = params.pop("gradient", None)

    if gradient == Gradient.none:
        gradient = None

    if url is not None:
        require_diffbot()
        # TODO: replace this with a more lightweight alternative than diffbot
        result = article(
            url,
            token=DIFFBOT_TOKEN,
            paging=False,
            discussion=False,
            maxTags=0,
            norender=True,
        )["objects"][0]
        pprint.pprint(result)
        text = result["text"]
    elif text is None:
        raise Exception('Must provide either "text" or "url".')

    sc.gen_stylecloud(
        **params,
        text=text,
        gradient=gradient,
        icon_dir="/tmp/icons",
        output_name=OUTPUT_NAME,
        background_color=background_color.as_hex()
    )

    return FileResponse(OUTPUT_NAME, media_type="image/png", headers=headers)
