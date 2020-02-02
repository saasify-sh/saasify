'use strict'

exports.rewriteJsonSchemaRefs = function rewriteJsonSchemaRefs(schema, opts) {
  if (Array.isArray(schema)) {
    schema.forEach((value) => rewriteJsonSchemaRefs(value, opts))
  } else if (typeof schema === 'object') {
    for (const [key, value] of Object.entries(schema)) {
      if (key === '$ref' && typeof value === 'string') {
        const { fromPrefix, toPrefix } = opts

        if (value.startsWith(fromPrefix)) {
          schema[key] = toPrefix + value.substr(fromPrefix.length)
        }
      }

      rewriteJsonSchemaRefs(value, opts)
    }
  }
}
