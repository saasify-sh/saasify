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

## Examples

The following examples pass binary images as the body of POST requests. Try them out yourself by replacing the image path with your own local test images.

See the following [docs](https://ec.haxx.se/http-post.html#posting-binary) for more info on curl's `--data-binary` option.

### PNG

```
curl --data-binary '@./examples/test-0.png' -o out.png \
  'https://api.saasify.sh/1/call/transitive-bullshit/imagemin@d9e48361'
```

- Before: 71834 bytes
- After: 29579 bytes
- Savings: 59%

All PNG optimizations make a best effort to remain **lossless**.

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/test-0-out.png" width="128" />

### JPEG

```
curl --data-binary '@./examples/nala.jpg' -o out.jpg \
  'https://api.saasify.sh/1/call/transitive-bullshit/imagemin@d9e48361'
```

- Before: 110069 bytes
- After: 92544 bytes
- Savings: 16%

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/imagemin/examples/nala-out.jpg" width="128" />

## License

MIT © [Saasify](https://saasify.sh)
