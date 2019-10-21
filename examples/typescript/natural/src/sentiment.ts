import * as natural from 'natural'

type Language = 'English' | 'Catalan' | 'Dutch' | 'Basque' | 'French' | 'Galician' | 'Italian' | 'Spanish'
type SentimentVocab = 'afinn' | 'senticon' | 'pattern'

declare module 'natural' {
  class SentimentAnalyzer {
    constructor(lang: string, stemmer?: natural.Stemmer, vocab?: SentimentVocab)
    getSentiment(input: string[]): number
  }
}

export function sentiment (input: string[], language: Language = 'English', vocab: SentimentVocab = 'afinn'): number {
  let analyzer: natural.SentimentAnalyzer

  try {
    analyzer = new natural.SentimentAnalyzer(language, null, vocab)
  } catch (err) {
    console.error(err)
    throw new Error(`unsupported language "${language}" and vocab "${vocab}" combination`)
  }

  return analyzer.getSentiment(input)
}