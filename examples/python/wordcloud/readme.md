# wordcloud

> Generate stylish wordclouds from any webpage.

<a href="https://wordcloud.saasify.sh">
  <img
    src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/promo.png"
    alt="Wordcloud Examples"
  />
</a>

## Supporting OSS

This project provides a hosted API for [stylecloud](https://github.com/minimaxir/stylecloud) and [wordcloud](https://github.com/amueller/word_cloud), by [minimaxir](https://github.com/minimaxir) and [amueller](https://github.com/amueller) respectively. **The majority of any revenue generated from this API is set aside for the original OSS developers**. If this is you, please [get in touch](https://saasify.sh/#/support) to setup payouts and answer any questions you may have.

## Hosted API

<a href="https://wordcloud.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

## Quick Start

Welcome to the quick-start! Below are the examples for the most popular ways to use this API using cURL. See the sidebar for all the other supported API's and REST methods!

### Generating a wordcloud from a URL

Wordclouds are a graphical cloud of words that fit the shape of free [Font Awesome](https://fontawesome.com/icons?d=gallery&m=free) icons using a color palette from [palettable](https://jiffyclub.github.io/palettable/).

The most common way is to generate a wordcloud from a news article, or other web page. For this, we can pass a `url` to the `/stylecloud` API:

#### Generating wordcloud via cURL

```sh
curl -X POST -o 'example.png' \
  'https://api.saasify.sh/1/call/dev/wordcloud/stylecloud' \
  -H 'content-type: application/json' \
  -d '{ "url": "https://www.theonion.com/new-day-same-bullshit-whispers-dalai-lama-before-sl-1839720347", "icon": "fas fa-flag" }'
```

generates an image called `example.png`, containing a wordcloud from [this article](https://www.theonion.com/new-day-same-bullshit-whispers-dalai-lama-before-sl-1839720347) with the [Font Awesome flag icon](https://fontawesome.com/icons/flag?style=solid)

#### example.png

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/stylecloud.png" width="256" />

Breaking down the example above, you can see the payload looks like:

#### Default Payload

```json
{
  "url": "https://www.theonion.com/new-day-same-bullshit-whispers-dalai-lama-before-sl-1839720347",
  "icon": "fas fa-flag"
}
```

Changing these parameters will change the generated image. Let's change the shape to use a bicycle by changing `icon` to [`fas fa-bicycle` from Font Awesome](https://fontawesome.com/icons/bicycle):

#### Generating a bicycle wordcloud

```sh
curl -X POST -o 'example.png' \
  'https://api.saasify.sh/1/call/dev/wordcloud/stylecloud' \
  -H 'content-type: application/json' \
  -d '{ "url": "https://www.theonion.com/new-day-same-bullshit-whispers-dalai-lama-before-sl-1839720347", "icon": "fas fa-bicycle" }'
```

#### example.png

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/bicycle.png" width="256" />

Great! Now let's change `palette` to [`cmocean.sequential.Matter_10` from palettable](https://jiffyclub.github.io/palettable/cmocean/sequential/#matter_10):

#### Generating a wordcloud with color palette

```sh
curl -X POST -o 'example.png' \
  'https://api.saasify.sh/1/call/dev/wordcloud/stylecloud' \
  -H 'content-type: application/json' \
  -d '{ "url": "https://www.theonion.com/new-day-same-bullshit-whispers-dalai-lama-before-sl-1839720347", "icon": "fas fa-bicycle" }'
```

#### example.png

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/bicycle.png" width="256" />

Awesome! To continue playing with the full power of the API, see [our API docs](https://wordcloud.saasify.sh/docs#tag/service). Hitting our rate limit? Make sure you [sign up to Unlimited](https://wordcloud.saasify.sh/pricing).

## License

MIT © [Saasify](https://saasify.sh)
