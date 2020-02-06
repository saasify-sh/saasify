'use strict'

const pick = require('lodash.pick')
const stringify = require('fast-json-stable-stringify')

const jsonContentType = 'application/json'

/**
 * Extracts any example inputs from an OpenAPI PathItem.
 *
 * *Assumes the OpenAPI spec has been fully dereferenced.*
 *
 * @param {object} pathItem - OpenAPI PathItem to extract examples from.
 *
 * @return {Promise}
 */
module.exports = async (pathItem) => {
  let hasOperationParams = false
  let examples = []

  for (const httpMethod of Object.keys(pathItem)) {
    const op = pathItem[httpMethod]

    if (op.requestBody && op.requestBody.content) {
      const mediaType = op.requestBody.content[jsonContentType]

      if (mediaType) {
        examples = examples.concat(
          getExamplesFromMediaType(mediaType, jsonContentType)
        )

        if (mediaType.schema) {
          examples = examples.concat(getExamplesFromSchema(mediaType.schema))
        }
      }
    }

    if (op.parameters) {
      hasOperationParams = true

      examples = examples.concat(
        getExamplesFromParameters([
          ...(pathItem.parameters || []),
          ...op.parameters
        ])
      )
    }
  }

  // filter out invalid examples
  examples = filterExamples(examples)

  if (!examples.length && pathItem.parameters && !hasOperationParams) {
    // use as a fallback because PathItem-level parameters may not include all params
    examples = examples.concat(getExamplesFromParameters(pathItem.parameters))
  }

  // TODO: is this too strict?
  // works well for standard json inputs but not for other primitive types
  // return examples.filter((example) => typeof example.input === 'object')

  // filter out invalid examples
  examples = filterExamples(examples)

  // filter and dedupe example candidates based on their content
  const exampleMap = {}
  for (const example of examples) {
    if (
      typeof example.input === 'string' &&
      example.inputContentType === jsonContentType
    ) {
      // coerce malformed JSON examples that have been stringified to be valid strings
      try {
        example.input = JSON.parse(example.input)
      } catch (err) {
        // ignore
      }
    }

    if (!isNonEmpty(example.input)) {
      continue
    }

    // TODO: filter out potential example candidates that don't validate against all of the operation schemas

    const key = stringify(pick(example, ['input', 'inputContentType']))

    exampleMap[key] = {
      ...exampleMap[key],
      ...example
    }
  }
  examples = Object.values(exampleMap)

  return examples
}

function isNonEmpty(obj) {
  if (Array.isArray(obj)) {
    return obj.some(isNonEmpty)
  } else if (typeof obj === 'object') {
    return Object.keys(obj).some((key) => isNonEmpty(obj[key]))
  }

  return obj !== undefined && obj !== null
}

function filterExamples(examples) {
  return examples.filter((example) => example && example.input !== undefined)
}

// https://swagger.io/specification/#mediaTypeObject
function getExamplesFromMediaType(mediaType, contentType) {
  let examples = []

  if (mediaType.example) {
    examples.push({
      input: mediaType.example,
      inputContentType: contentType
    })
  }

  if (mediaType.examples) {
    if (Array.isArray(mediaType.examples)) {
      examples = examples.concat(
        mediaType.examples.map((example) => ({
          input: example,
          inputContentType: contentType
        }))
      )
    } else {
      for (const name of Object.keys(mediaType.examples)) {
        // https://swagger.io/specification/#exampleObject
        const example = mediaType.examples[name]

        if (!example.value) {
          continue
        }

        // TODO: support `externalValue`
        examples.push({
          name,
          description: example.summary,
          input: example.value,
          inputContentType: contentType
        })
      }
    }
  }

  return examples
}

function getExamplesFromParameters(parameters) {
  const paramExamples = {}
  const required = new Set()

  for (const param of parameters) {
    let examples = []

    if (param.in === 'cookie' || param.in === 'header') {
      continue
    }

    if (param.required) {
      required.add(param.name)
    }

    examples = examples.concat(getExamplesFromMediaType(param, jsonContentType))

    if (param.content) {
      const mediaType = param.content[jsonContentType]

      if (mediaType) {
        examples = examples.concat(
          getExamplesFromMediaType(mediaType, jsonContentType)
        )
      }
    }

    if (param.schema) {
      examples = examples.concat(getExamplesFromSchema(param.schema))
    }

    examples = filterExamples(examples)

    if (examples.length) {
      paramExamples[param.name] = examples
    }
  }

  const hasRequiredExamples = Array.from(required).every(
    (key) => paramExamples[key]
  )

  if (hasRequiredExamples) {
    const aggregateExample = Object.keys(paramExamples).reduce(
      (acc, key) => ({
        ...acc,
        // TODO: should we always take the first example?
        [key]: paramExamples[key][0].input
      }),
      {}
    )

    return {
      input: aggregateExample,
      inputContentType: jsonContentType
    }
  }

  return []
}

function getExamplesFromSchema(schema, ctx) {
  // basic logic to prevent infinite recursion from circular references
  if (!ctx) {
    ctx = new Set()
  }
  if (ctx.has(schema)) {
    return []
  }
  ctx.add(schema)

  let examples = []

  if (schema) {
    examples = getExamplesFromMediaType(schema, jsonContentType)

    if (schema.default !== undefined) {
      examples.push({
        input: schema.default,
        inputContentType: jsonContentType
      })
    }

    // TODO: handle arrays
    // TODO: handle constants
    // TODO: handle enums with a single element
    // TODO: extract a valid value out of an enum

    if (schema.type === 'object' && schema.properties) {
      const propExamples = {}

      for (const key of Object.keys(schema.properties)) {
        const valueSchema = schema.properties[key]

        const currentPropExamples = filterExamples(
          getExamplesFromSchema(valueSchema, ctx)
        )

        if (currentPropExamples.length) {
          propExamples[key] = currentPropExamples
        }
      }

      const hasRequiredExamples = (schema.required || []).every(
        (key) => propExamples[key]
      )

      if (hasRequiredExamples) {
        const aggregateExample = Object.keys(propExamples).reduce(
          (acc, key) => ({
            ...acc,
            // TODO: should we always take the first example?
            [key]: propExamples[key][0].input
          }),
          {}
        )

        examples.push({
          input: aggregateExample,
          inputContentType: jsonContentType
        })
      }
    }
  }

  return examples
}
