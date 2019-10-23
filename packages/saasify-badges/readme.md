<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-badges

> Dynamic readme badges for [Saasify](https://saasify.sh) projects.

[![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Example

<a href="https://puppet-master.sh">
  <img
    src="https://badges.saasify.sh?text=Use%20Puppet%20Master%20API"
    height="40"
    alt="Puppet Master"
  />
</a>

- Badge URL: [https://badges.saasify.sh?text=Use%20Puppet%20Master%20API](https://badges.saasify.sh?text=Use%20Puppet%20Master%20API)

```html
<a href="https://puppet-master.sh">
  <img
    src="https://badges.saasify.sh?text=Use%20Puppet%20Master%20API"
    height="40"
    alt="Puppet Master"
  />
</a>
```

## Usage

This project is deployed to [https://badges.saasify.sh](https://badges.saasify.sh).

Parameters:
  - `text` is a URI-encoded string of text to display on the badge.
  - `type` defines the output image format (either `png` or `jpeg`).

<img
  src="https://badges.saasify.sh?cache=3"
  height="40"
  alt="Badge with default text"
/>

- Badge URL: [https://badges.saasify.sh](https://badges.saasify.sh)

<img
  src="https://badges.saasify.sh?text=Custom%20CTA&cache=3"
  height="40"
  alt="Badge with custom text"
/>

- Badge URL: [https://badges.saasify.sh?text=Custom%20CTA](https://badges.saasify.sh?text=Custom%20CTA)

All images are immutable and cached via our global CDN. While there may be a short 1-2s delay the first time a badge is generated, subsequent requests should resolve near instantly.

## Motivation

These badges are intended to be used alongside saasified versions of open source projects. These hosted APIs provide the following advantages:

- They enable you to start earning passive income off of your OSS work.
- They open up your project to new developers who use other programming languages and frameworks. Many OSS projects are isolated to one programming language or framework, but with Saasify, any developer who can use REST can use your project.
- Some OSS projects are difficult to setup, scale, and maintain. Saasifying your project makes it more accessible to other developers and companies who don't have the resources to focus on these details.

Check out [Saasify](http://saasify.sh) for more info on getting started!

## Related

- [shields.io](https://shields.io/) - Concise, consistent, and legible badges in SVG and raster format.
- [puppeteer-render-text](https://github.com/transitive-bullshit/puppeteer-render-text) - Robust text renderer using headless chrome.
- [saasify](https://saasify.sh) - The easiest way to launch your own SaaS!

## License

MIT © [Saasify](https://saasify.sh)
