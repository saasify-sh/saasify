'use strict'

const remark = require('remark')
const filter = require('unist-util-filter')
const find = require('unist-util-find')
const findAllAfter = require('unist-util-find-all-after')
const visit = require('unist-util-visit')

module.exports = (readme) => {
  const result = remark()
    .use(() => {
      return (tree) => {
        const firstH1 = find(tree, isH1)

        if (firstH1) {
          const firstHeading = find(tree, (node) => node.type === 'heading')
          const h1s = findAllAfter(tree, firstH1, isH1)

          if (h1s && h1s.length || (firstHeading !== firstH1)) {
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
    .processSync(readme)

  return result.toString()
}

const isH1 = (node) => {
  return (node.type === 'heading' && node.depth === 1)
}
