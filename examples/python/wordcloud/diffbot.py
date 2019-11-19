"""Diffbot API wrapper."""
import argparse
import json
import os

# import pprint
import sys
import urllib.request, urllib.parse, urllib.error

try:
    import requests
except ImportError:
    pass


ENCODING = "utf-8"

API_ROOT = "http://api.diffbot.com"
API_VERSION = 3


class Client(object):
    """Diffbot client."""

    _apis = frozenset(
        ("article", "frontpage", "product", "image", "analyze", "discussion")
    )

    def __init__(self, token, version=API_VERSION):
        """Initialise the client."""
        self._token = token
        self._version = version

    @staticmethod
    def _get(url, params=None):
        """HTTP GET request."""
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            # If JSON fails, return raw data
            # (e.g. when downloading CSV job logs).
            try:
                return response.json()
            except ValueError:
                return response.text
        except NameError:
            url = "{0}?{1}".format(url, urllib.parse.urlencode(params))
            return json.loads(urllib.request.urlopen(url).read().decode(ENCODING))

    @staticmethod
    def _post(url, data, content_type, params=None):
        """HTTP POST request."""
        try:
            response = requests.post(
                url, params=params, data=data, headers={"Content-Type": content_type,}
            )
            response.raise_for_status()
            return response.json()
        except NameError:
            url = "{0}?{1}".format(url, urllib.parse.urlencode(params))
            req = urllib.request.Request(
                url, data.encode(ENCODING), {"Content-Type": content_type,}
            )
            return json.loads(urllib.request.urlopen(req).read().decode(ENCODING))

    def endpoint(self, name):
        """Generate the URL endpoint for the given API."""
        return "{0}/v{1}/{2}".format(API_ROOT, self._version, name)

    def api(self, name, url, **kwargs):
        """Generic API method."""
        if name not in self._apis:
            raise ValueError(
                "API name must be one of {0}, not {1!r}.".format(
                    tuple(self._apis), name
                )
            )
        fields = kwargs.pop("fields", None)
        timeout = kwargs.pop("timeout", None)
        text = kwargs.pop("text", None)
        html = kwargs.pop("html", None)
        if text and html:
            raise ValueError("Both `text` and `html` arguments provided!")
        params = {**kwargs, "url": url, "token": self._token}
        if timeout:
            params["timeout"] = timeout
        if fields:
            if not isinstance(fields, str):
                fields = ",".join(sorted(fields))
            params["fields"] = fields
        url = self.endpoint(name)
        if text or html:
            content_type = html and "text/html" or "text/plain"
            return self._post(url, text or html, content_type, params=params)
        # pprint.pprint(params)
        return self._get(url, params=params)

    def article(self, url, **kwargs):
        """Article API."""
        return self.api("article", url, **kwargs)

    def frontpage(self, url, **kwargs):
        """Frontpage API."""
        return self.api("frontpage", url, **kwargs)

    def product(self, url, **kwargs):
        """Product API."""
        return self.api("product", url, **kwargs)

    def image(self, url, **kwargs):
        """Image API."""
        return self.api("image", url, **kwargs)

    def analyze(self, url, **kwargs):
        """Classifier (analyze) API."""
        return self.api("analyze", url, **kwargs)

    def discussion(self, url, **kwargs):
        """Discussion API."""
        return self.api("discussion", url, **kwargs)

    def crawl(self, urls, name="crawl", api="analyze", **kwargs):
        """Crawlbot API.
        Returns a diffbot.Job object to check and retrieve crawl status.
        """
        # If multiple seed URLs are specified, join with whitespace.
        if isinstance(urls, list):
            urls = " ".join(urls)
        url = self.endpoint("crawl")
        process_url = self.endpoint(api)
        params = {
            "token": self._token,
            "seeds": urls,
            "name": name,
            "apiUrl": process_url,
        }

        # Add any additional named parameters as accepted by Crawlbot
        params["maxToCrawl"] = 10
        params.update(kwargs)

        self._get(url, params=params)

        return Job(self._token, name, self._version)


class Job(Client):
    """An asynchronous job.
    This is used to check crawl status once a crawl job was started.
    """

    def __init__(self, token, name, version=API_VERSION):
        Client.__init__(self, token, version)
        self._name = name
        self._url = self.endpoint("crawl")

    def control(self, **kwargs):
        params = {"token": self._token, "name": self._name}
        params.update(kwargs)
        res = self._get(self._url, params)
        job = next(j for j in res["jobs"] if j["name"] == self._name)
        return job

    def pause(self):
        return self.control(pause=1)

    def unpause(self):
        return self.control(pause=0)

    def restart(self):
        return self.control(restart=1)

    def delete(self):
        return self.control(delete=1)

    def status(self):
        return self.control()

    def status_code(self):
        response = self.status()
        return response["jobStatus"]["status"]

    def is_finished(self):
        status_code = self.status_code()
        finished_codes = [1, 2, 3, 4, 5, 9]
        return status_code in finished_codes

    def is_running(self):
        status_code = self.status_code()
        running_codes = [0, 6, 7, 8]
        return status_code in running_codes

    def download(self, format="json"):
        download_url = "{0}/download/{1}-{2}_data.{3}".format(
            self._url, self._token, self._name, format
        )
        return self._get(download_url)


def api(name, url, token, **kwargs):
    """Shortcut for caling methods on `Client(token, version)`."""
    return Client(token).api(name, url, **kwargs)


def article(url, token, **kwargs):
    """Shortcut for `Client(token, version).article(url)`."""
    return api("article", url, token, **kwargs)


def frontpage(url, token, **kwargs):
    """Shortcut for `Client(token, version).frontpage(url)`."""
    return api("frontpage", url, token, **kwargs)


def product(url, token, **kwargs):
    """Shortcut for `Client(token, version).product(url)`."""
    return api("product", url, token, **kwargs)


def image(url, token, **kwargs):
    """Shortcut for `Client(token, version).image(url)`."""
    return api("image", url, token, **kwargs)


def analyze(url, token, **kwargs):
    """Shortcut for `Client(token, version).analyze(url)`."""
    return api("analyze", url, token, **kwargs)


def discussion(url, token, **kwargs):
    """Shortcut for `Client(token, version).discussion(url)`."""
    return api("discussion", url, token, **kwargs)


def cli():
    """Command line tool."""
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "api",
        help="""
        API to call.
        One one of 'article', 'frontpage', 'product', 'image', 'analyze', or
        'discussion'.
    """,
    )
    parser.add_argument(
        "url",
        help="""
        URL to pass as the 'url' parameter.
    """,
    )
    parser.add_argument(
        "token",
        help="""
        API key (token).
        Get one at https://www.diffbot.com/.
    """,
    )
    parser.add_argument(
        "-a",
        "--all",
        help="""
        Request all fields.
    """,
        action="store_true",
    )
    parser.add_argument(
        "-f",
        "--file",
        help="""
        File to read data from.
        Use '-' to read from STDIN.
    """,
    )
    fields = text = html = None
    _args = parser.parse_args()
    if _args.all:
        fields = "*"
    if _args.file == "-":
        text = sys.stdin.read()
    elif _args.file:
        with open(_args.file, "rb") as src:
            if os.path.splitext(_args.file)[1] in (".html", ".htm"):
                html = src.read().decode(ENCODING)
            else:
                text = src.read().decode(ENCODING)
    print(
        (
            json.dumps(
                (
                    api(
                        _args.api,
                        _args.url,
                        _args.token,
                        html=html or None,
                        text=text or None,
                        fields=fields,
                    )
                ),
                sort_keys=True,
                indent=2,
            )
        )
    )


if __name__ == "__main__":
    cli()  # pragma: no cover
