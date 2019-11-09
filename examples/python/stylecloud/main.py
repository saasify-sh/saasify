import os
import pprint
import diffbot

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
from stylecloud import stylecloud as sc
from typing import Optional
from wordcloud import WordCloud


class StyleCloudRequest(BaseModel):
    url: str = None
    text: str = None
    size: int = 512
    icon_name: str ='fas fa-flag'
    palette: str = 'cartocolors.qualitative.Bold_6'
    background_color: str = 'white'
    max_font_size: int = 200
    max_words: int = 2000
    stopwords: bool = True
    gradient: str = None


class WordCloudRequest(BaseModel):
    url: str = None
    text: str = None
    width: int = 400
    height: int = 200
    margin: int = 2
    ranks_only: bool = None
    prefer_horizontal: float = 0.9
    #mask: = None
    scale: float = 1
    #color_func = None
    max_words: int = 200
    min_font_size: int = 4
    #stopwords = None
    random_state: str = None
    background_color: str = 'black'
    max_font_size: Optional[int] = None
    font_step: float = 1
    mode: str = 'RGB'
    relative_scaling: str = 'auto'
    #regexp = None
    collocations: bool = True
    #colormap = None
    normalize_plurals: bool = True
    contour_width: float = 0
    contour_color: str = 'black'
    repeat: bool = False
    #include_numbers: bool = False
    #min_word_length: int = 0


load_dotenv()

app = FastAPI()

# ensure that all result images are cached aggressively
headers = {
    'Cache-Control': 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
}

responses = {
    200: {
        'content': {'image/png': {}},
        'description': 'Return a stylecloud image of the input text.',
    }
}

diffbotToken = os.getenv('DIFFBOT_TOKEN')

def requireDiffbot():
    if diffbotToken is None:
        raise Exception('url support requires a valid diffbot token')


'''
@app.get(
    '/stylecloud',
    responses=responses
)
def stylecloud(**kwargs: StyleCloudRequest):
    sc.gen_stylecloud(**kwargs)

    return FileResponse('stylecloud.png', media_type='image/png', headers=headers)
'''


@app.post(
    '/stylecloud',
    responses={
        200: {
            'content': {'image/png': {}},
            'description': 'Return a stylecloud image of the input text.',
        }
    }
)
def stylecloud(request: StyleCloudRequest):
    params = request.dict()
    url = params.pop('url', None)
    text = params.pop('text', None)

    if url is not None:
        requireDiffbot()
        article = diffbot.article(url, token=diffbotToken)['objects'][0]
        pprint.pprint(article)
        text = article['text']
    elif text is None:
        raise Exception('Must provide either"text" or "url".')


    sc.gen_stylecloud(**params, text=text)

    return FileResponse('stylecloud.png', media_type='image/png', headers=headers)


@app.post(
    '/wordcloud',
    responses=responses
)
def wordcloud(request: WordCloudRequest):
    params = request.dict()
    url = params.pop('url', None)
    text = params.pop('text', None)

    if url is not None:
        requireDiffbot()
        article = diffbot.article(url, token=diffbotToken).objects[0]
        pprint.pprint(article)
        text = article['text']
    elif text is None:
        raise Exception('Must provide either"text" or "url".')

    wc = WordCloud(**params)
    wc.generate_from_text(text)
    wc.to_file('wordcloud.png')

    return FileResponse('wordcloud.png', media_type='image/png', headers=headers)
