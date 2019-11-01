# imagemin example

> Image optimization as a service.

This project provides a hosted, SaaS version of [imagemin](https://github.com/imagemin/imagemin).

Note that the majority of the revenue from this hosted API goes back to the open source maintainers behind the original project.

<a href="https://transitive-bullshit_imagemin_6a7d90e3.saasify.sh">
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

### PNG

```
curl --data-binary "@./media/test-0.png" -o out.png \
  'https://api.saasify.sh/1/call/transitive-bullshit/imagemin@6a7d90e3.saasify.sh'
```

## License

MIT © [Saasify](https://saasify.sh)
