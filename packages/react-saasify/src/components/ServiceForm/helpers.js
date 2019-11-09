export const restrictDefinitionToExample = (definition, example, values) => ({
  ...definition,
  params: {
    schema: {
      properties: Object.keys(example.input).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            type: typeof example.input[key], // Catch rest params
            ...definition.params.schema.properties[key],
            default:
              typeof values[key] !== 'undefined'
                ? values[key]
                : example.input[key]
          }
        }),
        {}
      )
    }
  }
})

export const mergeInValues = (definition, values) => {
  const { properties } = definition.params.schema

  return {
    ...definition,
    params: {
      schema: {
        properties: Object.keys(properties).reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              ...properties[key],
              default: values[key]
            }
          }),
          {}
        )
      }
    }
  }
}
