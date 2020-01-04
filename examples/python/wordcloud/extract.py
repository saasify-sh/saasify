import os
import requests

EXTRACT_TOKEN = os.getenv("EXTRACT_TOKEN")


def extract(url):
    if EXTRACT_TOKEN is None:
        raise Exception("url support requires a valid auth token")

    api = "https://ssfy.sh/dev/article-extraction@fdc1e9ec/extractArticle"
    data = {"url": url}
    res = requests.get(api, params=data, headers={"Authorization": EXTRACT_TOKEN})

    return res.json()
