# sharp

> Powerful API for image conversion and manipulation.

This project provides a hosted API for [sharp](https://github.com/lovell/sharp) by [Lovell Fuller](https://github.com/lovell).

**We set aside the majority of any revenue generated from this API for the original OSS developers**. If you are one of these devs, please check out our [mission](https://saasify.sh/#/mission) and [get in touch](https://saasify.sh/#/support) to setup payouts and answer any questions you may have.

<a href="https://dev_sharp.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

## Examples

The following examples can all be invoked with the following curl template by changing out the `example.json` file:

```
curl -X POST -d '@example.json' \
  'https://ssfy.sh/dev/sharp'
```

### Download image

_example.json_

```json
{
  "input": "https://octodex.github.com/images/original.png"
}
```

```
curl -X POST -d '@example.json' -o out.png \
  'https://ssfy.sh/dev/sharp'
```

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/sharp/examples/1.png" width="128" />

### Convert png to jpeg

_example.json_

```json
{
  "input": "https://octodex.github.com/images/original.png",
  "ops": [
    {
      "op": "jpeg"
    }
  ]
}
```

```
curl -X POST -d '@example.json' -o out.jpg \
  'https://ssfy.sh/dev/sharp'
```

Here's this example as a GET request: [`/?input=https://octodex.github.com/images/original.png&ops[0][op]=jpeg`](https://ssfy.sh/dev/sharp/?input=https://octodex.github.com/images/original.png&ops[0][op]=jpeg).

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/sharp/examples/2.jpg" width="128" />

### Resize and convert to webp

_example.json_

```
{
  "input": "https://octodex.github.com/images/original.png",
  "ops": [
    {
      "op": "resize",
      "options": {
        "width": 220,
        "height": 128,
        "fit": "contain"
      }
    },
    {
      "op": "webp"
    }
  ]
}
```

```
curl -X POST -d '@example.json' -o out.webp \
  'https://ssfy.sh/dev/sharp'
```

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/sharp/examples/3.webp" width="128" />

### Blur and then flip vertically

_example.json_

```
{
  "input": "https://octodex.github.com/images/original.png",
  "ops": [
    {
      "op": "blur",
      "sigma": 10
    },
    {
      "op": "flip"
    }
  ]
}
```

```
curl -X POST -d '@example.json' -o out.png \
  'https://ssfy.sh/dev/sharp'
```

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/sharp/examples/4.png" width="128" />

### Tint, remove alpha, and convert to custom png

_example.json_

```
{
  "input": "https://octodex.github.com/images/original.png",
  "ops": [
    {
      "op": "tint",
      "rgb": "#7743CE"
    },
    {
      "op": "removeAlpha"
    },
    {
      "op": "png",
      "options": {
        "compressionLevel": 7
      }
    }
  ]
}
```

```
curl -X POST -d '@example.json' -o out.png \
  'https://ssfy.sh/dev/sharp'
```

<img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/examples/typescript/sharp/examples/5.png" width="128" />

### Get image metadata

_example.json_

```json
{
  "input": "https://octodex.github.com/images/original.png",
  "ops": [
    {
      "op": "metadata"
    }
  ]
}
```

```
curl -X POST -d '@example.json' -o out.json \
  'https://ssfy.sh/dev/sharp'
```

_output (JSON)_

```json
{
  "format": "png",
  "size": 36582,
  "width": 896,
  "height": 896,
  "space": "srgb",
  "channels": 4,
  "depth": "uchar",
  "density": 72,
  "isProgressive": false,
  "hasProfile": false,
  "hasAlpha": true
}
```

## Image Operations

The following [sharp](https://sharp.pixelplumbing.com/en/stable/) image operations are supported.

All `op` names and parameters mirror the sharp docs exactly.

### Input

- [x] [metadata](https://sharp.pixelplumbing.com/en/stable/api-input/#metadata)
- [x] [stats](https://sharp.pixelplumbing.com/en/stable/api-input/#stats)
- [x] [limitinputpixels](https://sharp.pixelplumbing.com/en/stable/api-input/#limitinputpixels)

### Output

- [x] [withMetadata](https://sharp.pixelplumbing.com/en/stable/api-output/#withmetadata)
- [x] [jpeg](https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg)
- [x] [png](https://sharp.pixelplumbing.com/en/stable/api-output/#png)
- [x] [webp](https://sharp.pixelplumbing.com/en/stable/api-output/#webp)
- [x] [tiff](https://sharp.pixelplumbing.com/en/stable/api-output/#tiff)
- [x] [raw](https://sharp.pixelplumbing.com/en/stable/api-output/#raw)
- [ ] [heif](https://sharp.pixelplumbing.com/en/stable/api-output/#heif)
- [ ] [tile](https://sharp.pixelplumbing.com/en/stable/api-output/#tile)

### Resizing

- [x] [resize](https://sharp.pixelplumbing.com/en/stable/api-resize/#resize)
- [x] [extend](https://sharp.pixelplumbing.com/en/stable/api-resize/#extend)
- [x] [extract](https://sharp.pixelplumbing.com/en/stable/api-resize/#extract)
- [x] [trim](https://sharp.pixelplumbing.com/en/stable/api-resize/#trim)

### Compositing

- [x] [composite](https://sharp.pixelplumbing.com/en/stable/api-composite/)

### Image Manipulation

- [x] [rotate](https://sharp.pixelplumbing.com/en/stable/api-operation/#rotate)
- [x] [flip](https://sharp.pixelplumbing.com/en/stable/api-operation/#flip)
- [x] [flop](https://sharp.pixelplumbing.com/en/stable/api-operation/#flop)
- [x] [sharpen](https://sharp.pixelplumbing.com/en/stable/api-operation/#sharpen)
- [x] [median](https://sharp.pixelplumbing.com/en/stable/api-operation/#median)
- [x] [blur](https://sharp.pixelplumbing.com/en/stable/api-operation/#blur)
- [x] [flatten](https://sharp.pixelplumbing.com/en/stable/api-operation/#flatten)
- [x] [gamma](https://sharp.pixelplumbing.com/en/stable/api-operation/#gamma)
- [x] [negate](https://sharp.pixelplumbing.com/en/stable/api-operation/#negate)
- [x] [normalize](https://sharp.pixelplumbing.com/en/stable/api-operation/#normalize)
- [x] [convolve](https://sharp.pixelplumbing.com/en/stable/api-operation/#convolve)
- [x] [threshold](https://sharp.pixelplumbing.com/en/stable/api-operation/#threshold)
- [x] [boolean](https://sharp.pixelplumbing.com/en/stable/api-operation/#)
- [x] [linear](https://sharp.pixelplumbing.com/en/stable/api-operation/#linear)
- [x] [recomb](https://sharp.pixelplumbing.com/en/stable/api-operation/#recomb)
- [x] [modulate](https://sharp.pixelplumbing.com/en/stable/api-operation/#modulate)

### Color Manipulation

- [x] [tint](https://sharp.pixelplumbing.com/en/stable/api-colour/#tint)
- [x] [greyscale](https://sharp.pixelplumbing.com/en/stable/api-colour/#greyscale)
- [x] [toColorspace](https://sharp.pixelplumbing.com/en/stable/api-colour/#tocolorspace)

### Channel Manipulation

- [x] [removeAlpha](https://sharp.pixelplumbing.com/en/stable/api-channel/#removealpha)
- [x] [ensureAlpha](https://sharp.pixelplumbing.com/en/stable/api-channel/#ensurealpha)
- [x] [extractChannel](https://sharp.pixelplumbing.com/en/stable/api-channel/#extractChannel)
- [ ] [joinChannel](https://sharp.pixelplumbing.com/en/stable/api-channel/#joinchannel)
- [x] [bandBool](https://sharp.pixelplumbing.com/en/stable/api-channel/#bandbool)

## License

This SaaS project was bootstrapped with [Saasify](https://saasify.sh).

MIT © [Saasify](https://saasify.sh)
