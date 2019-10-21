import * as natural from 'natural'

type Inflector = 'noun' | 'present-tense'

export function singularize (input: string, inflector: Inflector = 'noun'): string {
  switch (inflector) {
    case 'noun': {
      const impl = new natural.NounInflector()
      return impl.singularize(input)
    }
    case 'present-tense': {
      const impl = new natural.PresentVerbInflector()
      return impl.singularize(input)
    }
    default:
      break
  }
}