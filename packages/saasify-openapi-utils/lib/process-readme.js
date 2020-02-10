'use strict'

const remark = require('remark')
const filter = require('unist-util-filter')
const find = require('unist-util-find')
const findAllAfter = require('unist-util-find-all-after')
const findAllBetween = require('unist-util-find-all-between')
const visit = require('unist-util-visit')
const u = require('unist-builder')

/**
 * Pre-processes a markdown readme for display in Saasify's Redoc docs.
 *
 * @param {string} rawReadme - Raw markdown readme string.
 *
 * @return {string}
 */
module.exports = (rawReadme) => {
  const readme = remark()
    .use(() => {
      return (tree) => {
        const firstH1 = find(tree, isH1)

        if (firstH1) {
          const firstHeading = find(tree, (node) => node.type === 'heading')
          const h1s = findAllAfter(tree, firstH1, isH1)

          if ((h1s && h1s.length) || firstHeading !== firstH1) {
            // indent all headings
            visit(tree, (node) => {
              if (node.type === 'heading') {
                node.depth = Math.min(node.depth + 1, 6)
              }
            })
          } else {
            return filter(tree, (node) => !isH1(node))
          }
        }
      }
    })
    .processSync(rawReadme)

  const quickStart = remark()
    .use(filterToSection('Quick Start'))
    .processSync(rawReadme)
    .toString()

  const supportingOSS = remark()
    .use(filterToSection('Supporting OSS'))
    .processSync(rawReadme)
    .toString()

  const readmeValue = readme.toString().trim()
  return {
    readme: readmeValue ? `# Readme\n\n${readmeValue}` : '',
    quickStart: quickStart !== '\n' ? quickStart : '',
    supportingOSS: supportingOSS !== '\n' ? supportingOSS : ''
  }
}

const filterToSection = (headingTitle) => () => (tree) => {
  const sectionHeading = find(tree, (node) => isHeading(node, 2, headingTitle))

  if (sectionHeading) {
    const h2s = findAllAfter(tree, sectionHeading, isH2)

    const content =
      h2s && h2s.length
        ? findAllBetween(tree, sectionHeading, h2s[0])
        : findAllAfter(tree, sectionHeading)

    const filtered = u('root', [sectionHeading, ...content])

    // unindent all headings
    visit(filtered, (node) => {
      if (node.type === 'heading') {
        node.depth = Math.max(node.depth - 1, 1)
      }
    })

    return filtered
  }

  return u('root', [])
}

const isHeading = (node, depth, value) =>
  node.type === 'heading' &&
  node.depth === depth &&
  !!(value
    ? find(node, (child) => child.type === 'text' && child.value === value)
    : true)

const isH1 = (node) => isHeading(node, 1)

const isH2 = (node) => isHeading(node, 2)
