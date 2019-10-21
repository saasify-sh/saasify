import * as natural from 'natural'

type Inflector = 'noun' | 'present-tense'

export function pluralize (input: string, inflector: Inflector = 'noun'): string {
  switch (inflector) {
    case 'noun': {
      const impl = new natural.NounInflector()
      return impl.pluralize(input)
    }
    case 'present-tense': {
      const impl = new natural.PresentVerbInflector()
      return impl.pluralize(input)
    }
    default:
      break
  }
}