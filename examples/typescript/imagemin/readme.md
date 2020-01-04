# imagemin example

> A lightning fast image optimization API, built on top of [imagemin for Node.js](https://github.com/imagemin/imagemin).

<a href="https://imagemin.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

## Quick Start

Welcome to the quick-start! Below are some examples for common ways of using the API via `cURL`.

Also be sure to check out the full reference of [API endpoints](https://imagemin.saasify.sh/docs#tag/service).

### Intro

This API is a hosted version of the open source [imagemin library](https://github.com/imagemin/imagemin). The examples here show how to use the library via an API endpoint.

The following image formats are supported:

- `png`
- `jpg` / `jpeg`
- `webp`
- `svg`
- `gif`

### Optimizing an image via a URL

Providing an image URL is the easiest way to use this API.

```
curl --request POST -o optimized.png \
  --url 'https://ssfy.sh/dev/imagemin/optimizeImageUrl' \
  --header 'content-type: application/json' \
  --data '{"url":"https://octodex.github.com/images/original.png"}'
```

- Before: 36582 bytes
- After: 20176 bytes
- Savings: 45%

> All PNG optimizations make a best effort to remain **lossless**.

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/github-out.png" width="128" />

### Optimizing an image payload

You can also provide binary image data as the body of POST requests. Try replacing the image path with your own local test image.

```
curl --data-binary '@./examples/test-0.png' -o optimized.png \
  'https://ssfy.sh/dev/imagemin/optimizeImage'
```

> See the following [docs](https://ec.haxx.se/http-post.html#posting-binary) for more info on curl's `--data-binary` option.

- Before: 71834 bytes
- After: 29579 bytes
- Savings: 59%

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/test-0-out.png" width="128" />

## License

MIT © [Saasify](https://saasify.sh)
