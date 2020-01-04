# remove-bg

> Smart image background removal! 🤯

<a href="https://dev_remove-bg.saasify.sh">
  <img
    src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/media/splash-0.jpg"
    alt="Image Background Removal Example"
  />
</a>

## Usage

<a href="https://dev_remove-bg.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

This API supports the following image formats:

- `png`
- `jpg` / `jpeg`

You may pass the input image either as a `url`, `base64`-encoded string, or as a raw request body.

We recommend using either the `url` or `base64` versions because they come with lots of customization options.

## Examples

The following examples all use the `/removeBgUrl` endpoint and pass a remote image URL to process.

### Person Example

```
curl --request POST -o 'girl-no-bg.png' \
  --url 'https://ssfy.sh/dev/remove-bg/removeBgUrl' \
  --header 'content-type: application/json' \
  --data '{"url":"https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/cc.jpg"}'
```

<p>
  <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/cc.jpg" width="256" />
  <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/girl-no-bg.png" width="256" />
</p>

### Product Example

```
curl --request POST -o 'pg-no-bg.png' \
  --url 'https://ssfy.sh/dev/remove-bg/removeBgUrl' \
  --header 'content-type: application/json' \
  --data '{"url":"https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/pg.jpg"}'
```

<p>
  <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/pg.jpg" width="256" />
  <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/pg-no-bg.png" width="256" />
</p>

### Car Example

```
curl --request POST -o 'jb-no-bg.png' \
  --url 'https://ssfy.sh/dev/remove-bg/removeBgUrl' \
  --header 'content-type: application/json' \
  --data '{"url":"https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/jb.jpg"}'
```

<p>
  <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/jb.jpg" width="256" />
  <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/examples/jb-no-bg.png" width="256" />
</p>

## Additional Examples

<img
  src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/remove-bg/media/splash-1.jpg"
  alt="Image Background Removal Examples"
/>

## License

MIT © [Saasify](https://saasify.sh)
