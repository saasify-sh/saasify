'use strict'

exports.pruneCustomKeywords = function pruneCustomKeywords(schema) {
  if (Array.isArray(schema)) {
    schema.forEach(pruneCustomKeywords)
  } else if (typeof schema === 'object') {
    // TODO: this is a bit hacky and could delete valid params
    // we need a more structured traversal
    delete schema.coerceTo
    delete schema.coerceFrom
    Object.values(schema).forEach(pruneCustomKeywords)
  }
}
