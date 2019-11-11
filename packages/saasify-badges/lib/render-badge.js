'use strict'

const fs = require('fs')
const ow = require('ow')
const path = require('path')
const puppeteer = require('puppeteer-serverless').default

const { cssifyObject } = require('css-in-js-utils')

const observerScript = fs.readFileSync(
  path.join(__dirname, 'fontfaceobserver.standalone.js'),
  'utf8'
)
const observer = `
<script>
  ${observerScript}
</script>
`

/**
 * Renders the given text / html via puppeteer.
 *
 * Asynchronously returns the generated html page as a string for debugging purposes.
 *
 * If you want to load multiple google fonts, juse specify their font-families in `opts.style.fontFamily`
 * separated by commas as you normally would for CSS fonts.
 *
 * @name renderBadge
 * @function
 *
 * @param {object} opts - Configuration options
 * @param {string} opts.text - HTML content to render
 * @param {string} [opts.output] - Optional path of image file to store result. If not given, returns a Buffer containing the image data.
 * @param {number} [opts.width] - Optional max width for word-wrap
 * @param {number} [opts.height] - Optional max height to clip overflow
 * @param {string} [opts.loadFontFamily] - Optional font family to load with fontfaceobserver
 * @param {boolean} [opts.loadGoogleFont=false] - Whether or not to load and wait for `opts.style.fontFamily` as one or more google fonts
 * @param {object} [opts.style={}] - JS [CSS styles](https://www.w3schools.com/jsref/dom_obj_style.asp) to apply to the text's container div
 * @param {object} [opts.inject={}] - Optionally injects arbitrary string content into the head, style, or body elements.
 * @param {string} [opts.inject.head] - Optionally injected into the document <head>
 * @param {string} [opts.inject.style] - Optionally injected into a <style> tag within the document <head>
 * @param {string} [opts.inject.body] - Optionally injected into the document <body>
 *
 * @return {Promise}
 */
module.exports = async (opts) => {
  const {
    text,
    output,
    width = undefined,
    height = undefined,
    loadFontFamily = undefined,
    loadGoogleFont = false,
    type = 'png',
    style = {},
    inject = {}
  } = opts

  if (output) {
    ow(output, ow.string.nonEmpty.label('output'))
  }

  ow(text, ow.string.label('text'))
  ow(style, ow.object.plain.label('style'))

  const { fontFamily } = style

  if (loadGoogleFont && !fontFamily) {
    throw new Error('valid style.fontFamily required when loading google font')
  }

  const fonts = loadFontFamily
    ? [loadFontFamily]
    : loadGoogleFont
    ? fontFamily.split(',').map((font) => font.trim())
    : []

  const fontHeader = loadFontFamily
    ? observer
    : loadGoogleFont
    ? `
      ${observer}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${fonts
        .map((font) => font.replace(/ /g, '+'))
        .join('|')}">
    `
    : ''

  const fontsToLoad = fonts.map((font) => `new FontFaceObserver('${font}')`)
  const fontLoader = fontsToLoad.length
    ? `Promise.all([ ${fontsToLoad.join(
        ', '
      )} ].map((f) => f.load())).then(ready);`
    : 'ready();'

  const html = `
<html>
<head>
  <meta charset="UTF-8">

  ${inject.head || ''}
  ${fontHeader}

  <style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: transparent;

  ${width ? 'max-width: ' + width + 'px;' : ''}
  ${height ? 'max-height: ' + height + 'px;' : ''}

  overflow: hidden;
}

.badge {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #5061cb;
  background: linear-gradient(
    160deg,
    rgba(110, 96, 225, 1) 0%,
    rgba(27, 59, 135, 1) 100%
  );
  border-radius: 4px;
  color: #fff;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  letter-spacing: 0.02em;

  ${width ? '' : 'white-space: nowrap;'}
  ${cssifyObject(style)}
}

.wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.lhs {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.7em;
  line-height: 1em;
}

.rhs {
  padding: 0.7em;
  line-height: 1em;
}

  ${inject.style || ''}
  </style>
</head>

<body>
${inject.body || ''}

<div class="badge"><div class="wrapper"><div class="lhs"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIxNXB4IiB2aWV3Qm94PSIwIDAgMjQgMTUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU2LjMgKDgxNzE2KSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Db21iaW5lZCBTaGFwZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5LjAwMDAwMCwgLTMxLjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuMDAwMDAwLCAxNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zMywzMiBMMTcsMzIgQzE0Ljc5MDg2MSwzMiAxMywzMC4yMDkxMzkgMTMsMjggQzEzLDI1Ljc5MDg2MSAxNC43OTA4NjEsMjQgMTcsMjQgTDE3LjQxNjA0MzcsMjQgQzE3LjE0ODQ0NzUsMjMuMzg3NTM3NyAxNywyMi43MTExMDQ3IDE3LDIyIEMxNywxOS4yMzg1NzYzIDE5LjIzODU3NjMsMTcgMjIsMTcgQzI0LjI3NDg3MDQsMTcgMjYuMTk0OTA5MiwxOC41MTkyMTQ1IDI2LjgwMDg5MzgsMjAuNTk4NDIwOCBDMjcuNTMwNzMxNCwxOS42Mjc3NjE3IDI4LjY5MjA1NDksMTkgMzAsMTkgQzMyLjIwOTEzOSwxOSAzNCwyMC43OTA4NjEgMzQsMjMgQzM0LDIzLjM3ODAwNzcgMzMuOTQ3NTY1NSwyMy43NDM3Njg3IDMzLjg0OTU3MzEsMjQuMDkwNDA2NCBDMzUuNjUwNjEsMjQuNDc5OTQyIDM3LDI2LjA4MjM4NzUgMzcsMjggQzM3LDMwLjIwOTEzOSAzNS4yMDkxMzksMzIgMzMsMzIgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==" /></div><div class="rhs"><span class="text">${text}</span></div></div></div>

<script>
  function ready () {
    var div = document.createElement('div');
    div.className = 'ready';
    document.body.appendChild(div);
  }
  ${fontLoader}
</script>

</body>
</html>
`

  // testing
  // const fs = require('fs')
  // fs.writeFileSync('test.html', html)

  const browser = opts.browser || (await puppeteer.launch())
  const page = await browser.newPage()

  page.on('console', console.log)
  page.on('error', console.error)

  await page.setViewport({
    deviceScaleFactor: 2,
    width: width || 640,
    height: height || 480
  })
  await page.setContent(html)
  await page.waitForSelector('.ready')

  const frame = page.mainFrame()
  const handle = await frame.$('.badge')
  const result = await handle.screenshot({
    path: output,
    omitBackground: true,
    type
  })
  await handle.dispose()
  await browser.close()

  return result
}
