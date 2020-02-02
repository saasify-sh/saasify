'use strict'

const jsonSchemaRefParser = require('json-schema-ref-parser')

const { rewriteJsonSchemaRefs } = require('./rewrite-json-schema-refs')
const { pruneCustomKeywords } = require('./prune-custom-keywords')
const { pruneJsonSchemaTypes } = require('./prune-json-schema-types')

exports.prepareJsonSchema = async function prepareJsonSchema(
  schema,
  components
) {
  const result = await jsonSchemaRefParser.dereference(schema)

  // update all $refs from '#/definitions/' to '#/components/schemas/'
  rewriteJsonSchemaRefs(result, {
    fromPrefix: '#/definitions/',
    toPrefix: '#/components/schemas/'
  })

  // prune custom FTS keywords
  pruneCustomKeywords(result)

  // prune incompatible types
  pruneJsonSchemaTypes(result)

  // TODO: how should we handle duplicates here?
  components.schemas = {
    ...components.schemas,
    ...result.definitions
  }

  // all $refs have been replaced directly, so remove any indirect definitions
  delete result.$ref
  delete result.definitions

  return result
}
