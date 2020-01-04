# wordcloud

> Generate stylish wordclouds from any webpage.

<a href="https://wordcloud.saasify.sh">
  <img
    src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/promo.png"
    alt="Wordcloud Examples"
  />
</a>

## Supporting OSS

This project provides a hosted API for [stylecloud](https://github.com/minimaxir/stylecloud) and [wordcloud](https://github.com/amueller/word_cloud), by [minimaxir](https://github.com/minimaxir) and [amueller](https://github.com/amueller) respectively.

**We set aside the majority of any revenue generated from this API for the original OSS developers**. If this is you, please [get in touch](https://saasify.sh/#/support) to setup payouts and answer any questions you may have.

## Hosted API

<a href="https://wordcloud.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

## Quick Start

Welcome to the quick-start! Below are some examples for common ways of using the API via `cURL`.

Also be sure to check out the full reference of [API endpoints](https://wordcloud.saasify.sh/docs#tag/service).

### Intro

Wordclouds are a graphical cloud of words that fit the shape of free [Font Awesome](https://fontawesome.com/icons?d=gallery&m=free) icons using a color palette from [palettable](https://jiffyclub.github.io/palettable/).

The most common use case is to generate a wordcloud from a news article or other webpage. For this, we can pass a `url` to the `/stylecloud` API.

### Generating a wordcloud from a URL

```sh
curl -X POST -o 'example.png' \
  'https://ssfy.sh/dev/wordcloud/stylecloud' \
  -H 'content-type: application/json' \
  -d '{
    "url": "https://www.bbc.com/sport/athletics/50460861",
    "icon": "fas fa-running"
  }'
```

This example generates an image stored in `example.png`, containing a wordcloud from [this article](https://www.bbc.com/sport/athletics/50460861) with the [running icon](https://fontawesome.com/icons/running?style=solid).

*example.png*

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/running.png" width="256" />

Breaking down the example above, you can see the payload looks like:

*Default Payload*

```json
{
  "url": "https://www.bbc.com/sport/athletics/50460861",
  "icon": "fas fa-running"
}
```

Changing these parameters will change the generated image.

### Generating a wordcloud from a Wikipedia article

Let's try changing the shape to a swimming icon [`fas fa-swimmer`](https://fontawesome.com/icons/swimmer?style=solid) from Font Awesome and use the wikipedia page for [Michael Phelps](https://en.wikipedia.org/wiki/Michael_Phelps).

```sh
curl -X POST -o 'example.png' \
  'https://ssfy.sh/dev/wordcloud/stylecloud' \
  -H 'content-type: application/json' \
  -d '{
    "url": "https://en.wikipedia.org/wiki/Michael_Phelps",
    "icon": "fas fa-swimmer",
    "gradient": "none"
  }'
```

*example.png*

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/michael-phelps.png" width="256" />

### Generating a wordcloud with custom color palette

Now let's try changing the `palette` to [`cmocean.sequential.Matter_10`](https://jiffyclub.github.io/palettable/cmocean/sequential/#matter_10) from palettable.

```sh
curl -X POST -o 'example.png' \
  'https://ssfy.sh/dev/wordcloud/stylecloud' \
  -H 'content-type: application/json' \
  -d '{
    "url": "https://blog.ycombinator.com/ycs-essential-startup-advice/",
    "icon": "fab fa-y-combinator",
    "palette": "cmocean.sequential.Matter_10",
    "gradient": "none"
  }'
```

*example.png*

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/yc.png" width="256" />

Awesome! To continue playing with the full power of the API, check out [our API docs](https://wordcloud.saasify.sh/docs#tag/service).

Hitting our public rate limit? Consider [upgrading](https://wordcloud.saasify.sh/pricing) to remove all rate limits.

## License

MIT © [Saasify](https://saasify.sh)
