"""
class WordCloudRequest(BaseModel):
    url: str = None
    text: str = None
    width: int = 400
    height: int = 200
    margin: int = 2
    ranks_only: bool = None
    prefer_horizontal: float = 0.9
    # mask: = None
    scale: float = 1
    # color_func = None
    max_words: int = 2000
    min_font_size: int = 4
    # stopwords = None
    random_state: str = None
    background_color: str = "black"
    max_font_size: Optional[int] = None
    font_step: float = 1
    mode: str = "RGB"
    relative_scaling: str = "auto"
    # regexp = None
    collocations: bool = True
    # colormap = None
    normalize_plurals: bool = True
    contour_width: float = 0
    contour_color: str = "black"
    repeat: bool = False
    # include_numbers: bool = False
    # min_word_length: int = 0
"""


"""
@app.post("/wordcloud", responses=responses)
def wordcloud(request: WordCloudRequest):
    params = request.dict()
    url = params.pop("url", None)
    text = params.pop("text", None)

    if url is not None:
        require_diffbot()
        article = diffbot.article(url, token=DIFFBOT_TOKEN)["objects"][0]
        pprint.pprint(article)
        text = article["text"]
    elif text is None:
        raise Exception('Must provide either"text" or "url".')

    wc = WordCloud(**params)
    wc.generate_from_text(text)
    wc.to_file(OUTPUT_NAME)

    return FileResponse(OUTPUT_NAME, media_type="image/png", headers=headers)
"""
