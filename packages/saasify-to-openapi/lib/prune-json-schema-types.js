'use strict'

exports.pruneJsonSchemaTypes = function pruneJsonSchemaTypes(schema) {
  if (Array.isArray(schema)) {
    schema.forEach(pruneJsonSchemaTypes)
  } else if (typeof schema === 'object') {
    for (const [key, value] of Object.entries(schema)) {
      if (key === 'type') {
        if (Array.isArray(value)) {
          // OpenAPI doesn't support certain ambiguous oneOf types like:
          // - number | boolean
          // - number | string
          // - string | boolean
          const types = {
            number: 0,
            string: 0,
            boolean: 0
          }

          for (const v of value) {
            types[v]++
          }

          if (types.number + types.string + types.boolean >= 2) {
            if (types.string) {
              schema[key] = 'string'
            } else if (types.number) {
              schema[key] = 'number'
            } else {
              schema[key] = 'boolean'
            }
          }
        }

        if (schema.items && Array.isArray(schema.items)) {
          // TODO: figure out a better fallback type for these cases
          // a variable-length array is commonly used for numbers but could also be used
          // for strings, booleans, etc.
          schema.items = { type: 'number' }
          delete schema.additionalItems
        }
      }

      pruneJsonSchemaTypes(value)
    }
  }
}
