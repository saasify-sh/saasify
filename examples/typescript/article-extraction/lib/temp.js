'use strict'

const metascraper = require('metascraper')
const metascraperAuthor = require('metascraper-author')
const metascraperDate = require('metascraper-date')
const metascraperDescription = require('metascraper-description')
const metascraperImage = require('metascraper-image')
const metascraperLang = require('metascraper-lang')
const metascraperLogo = require('metascraper-logo')
const metascraperPublisher = require('metascraper-publisher')
const metascraperReadability = require('metascraper-readability')
const metascraperTitle = require('metascraper-title')
const metascraperUrl = require('metascraper-url')
const fetch = require('node-fetch')
const extractor = require('unfluff')
const { isUri } = require('valid-url')
const get = require('lodash.get')
const Readability = require('readability')
const sanitize = require('sanitize-html')
const { JSDOM } = require('jsdom')

module.exports = async (url) => {
  const valid = isUri(url)

  if (valid) {
    const scraper = metascraper([
      metascraperAuthor(),
      metascraperDate(),
      metascraperDescription(),
      metascraperImage(),
      metascraperLang(),
      metascraperLogo(),
      metascraperPublisher(),
      metascraperReadability(),
      metascraperTitle(),
      metascraperUrl()
    ])

    const html = await fetch(url).text()

    const metadata = await scraper({ html, url })
    const jsdom = new JSDOM(html, {
      url
    })
    const article = new Readability(jsdom.window.document).parse()

    const content = sanitize(get(article, 'content'), {
      allowedTags: sanitize.defaults.allowedTags.concat(['img'])
    })
    const unfluff = extractor(html)
    const sanitized = extractor(content)

    const links = get(sanitized, 'links', []).filter((link) => {
      return isUri(link.href)
    })

    return {
      author: get(metadata, 'author'),
      logo: get(metadata, 'logo'),
      favicon: get(unfluff, 'favicon'),
      image: get(metadata, 'image') || get(unfluff, 'image'),
      publisher: get(metadata, 'publisher') || get(unfluff, 'publisher'),
      date: get(metadata, 'date') || get(unfluff, 'date'),
      description: get(unfluff, 'description'),
      lang: get(unfluff, 'lang'),
      title: get(metadata, 'title') || get(unfluff, 'title'),
      url: get(metadata, 'url') || get(unfluff, 'url'),
      text: get(sanitized, 'text'),
      tags: get(unfluff, 'tags'),
      links,
      content,
      html
    }
  }
}
