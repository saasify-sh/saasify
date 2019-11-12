# wordcloud

> Generate stylish wordclouds from any webpage.

<a href="https://wordcloud.saasify.sh">
  <img
    src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/promo.png"
    alt="Wordcloud Examples"
  />
</a>

This project provides a hosted, SaaS API for [stylecloud](https://github.com/minimaxir/stylecloud) and [wordcloud](https://github.com/amueller/word_cloud), by [minimaxir](https://github.com/minimaxir) and [amueller](https://github.com/amueller) respectively.

The goal is to make it as easy as possible for developers of any programming language to use these amazing OSS projects, while also helping these OSS authors to fund their work.

**We set aside the majority of any revenue generated from this API for the original OSS developers**. If you are one of these devs, please check out our [mission](https://saasify.sh/#/mission) and [get in touch](https://saasify.sh/#/support) to setup payouts and answer any questions you may have.

<a href="https://wordcloud.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

## Usage

All endpoints take in either a `url` or `text`, in addition to a number of optional customization parameters.

If you pass a `url`, the webpage will be parsed with only the sanitized main body content being passed as `text`.

If you pass `text` directly, the words in the text will be used to create the wordcloud.

### Stylecloud

Styleclouds are wordclouds that fit the shape of a [Font Awesome]() icon.

## Examples

### The Onion

```
curl -X POST -o 'example.png' \
  'https://api.saasify.sh/1/call/dev/wordcloud/stylecloud' \
  -H 'content-type: application/json' \
  -d '{ "url": "https://www.theonion.com/new-day-same-bullshit-whispers-dalai-lama-before-sl-1839720347" }'
```

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/python/wordcloud/examples/stylecloud.png" width="256" />
