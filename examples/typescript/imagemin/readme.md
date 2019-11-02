# imagemin example

> Image optimization as a service.

This project provides a hosted, SaaS version of [imagemin](https://github.com/imagemin/imagemin).

Note that the majority of the revenue from this hosted API goes back to the open source maintainers behind the original project.

<a href="https://transitive-bullshit_imagemin_d9e48361.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

## Usage

This API supports the following image formats:

- `png`
- `jpg` / `jpeg`
- `webp`
- `svg`
- `gif`

## URL Image Examples

The following examples pass a URL to a remote image and download the optimized result.

Try them out yourself by replacing the `url` parameter with your own image URLs.

### PNG

```
curl --request POST -o 'optimized.png' \
  --url 'https://api.saasify.sh/1/call/transitive-bullshit/imagemin@d9e48361/optimizeImageUrl' \
  --header 'content-type: application/json' \
  --data '{"url":"https://octodex.github.com/images/original.png"}'
```

- Before: 36582 bytes
- After: 20176 bytes
- Savings: 45%

All PNG optimizations make a best effort to remain **lossless**.

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/github-out.png" width="128" />

### JPG

```
curl --request POST -o 'optimized.jpg' \
  --url 'https://api.saasify.sh/1/call/transitive-bullshit/imagemin@d9e48361/optimizeImageUrl' \
  --header 'content-type: application/json' \
  --data '{"url":"https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/nala-out.jpg"}'
```

- Before: 110069 bytes
- After: 92544 bytes
- Savings: 16%

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/nala-out.jpg" width="128" />

## Raw Image Examples

The following examples pass binary image data as the body of POST requests. Try them out yourself by replacing the image path with your own local test images.

See the following [docs](https://ec.haxx.se/http-post.html#posting-binary) for more info on curl's `--data-binary` option.

### PNG

```
curl --data-binary '@./examples/test-0.png' -o out.png \
  'https://api.saasify.sh/1/call/transitive-bullshit/imagemin@d9e48361/optimizeImage'
```

- Before: 71834 bytes
- After: 29579 bytes
- Savings: 59%

All PNG optimizations make a best effort to remain **lossless**.

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/test-0-out.png" width="128" />

### JPEG

```
curl --data-binary '@./examples/nala.jpg' -o out.jpg \
  'https://api.saasify.sh/1/call/transitive-bullshit/imagemin@d9e48361/optimizeImage'
```

- Before: 110069 bytes
- After: 92544 bytes
- Savings: 16%

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/nala-out.jpg" width="128" />

## License

MIT © [Saasify](https://saasify.sh)
