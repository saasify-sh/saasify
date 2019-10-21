import * as natural from 'natural'

type Language = 'en' | 'nl' | 'fa' | 'fr' | 'id' | 'it' | 'ja' | 'no' | 'pt' | 'ru' | 'sv'
type Stemmer = 'porter' | 'lancaster'

declare module 'natural' {
  var PorterStemmerNl: natural.Stemmer
  var StemmerId: natural.Stemmer
  var StemmerJa: natural.Stemmer
  var PorterStemmerSv: natural.Stemmer
}

export function stem (word: string, language: Language = 'en', stemmer: Stemmer = 'porter'): string {
  switch (language) {
    case 'en':
      if (stemmer === 'porter') {
        return natural.PorterStemmer.stem(word)
      } else {
        return natural.LancasterStemmer.stem(word)
      }
    case 'nl':
      if (stemmer === 'porter') {
        return natural.PorterStemmerNl.stem(word)
      }
      break
    case 'fa':
      if (stemmer === 'porter') {
        return natural.PorterStemmerFa.stem(word)
      }
      break
    case 'fr':
      if (stemmer === 'porter') {
        return natural.PorterStemmerFr.stem(word)
      }
      break
    case 'id':
      return natural.StemmerId.stem(word)
    case 'ja':
      return natural.StemmerJa.stem(word)
    case 'it':
      if (stemmer === 'porter') {
        return natural.PorterStemmerIt.stem(word)
      }
      break
    case 'no':
      if (stemmer === 'porter') {
        return natural.PorterStemmerNo.stem(word)
      }
      break
    case 'pt':
      if (stemmer === 'porter') {
        return natural.PorterStemmerPt.stem(word)
      }
      break
    case 'ru':
      if (stemmer === 'porter') {
        return natural.PorterStemmerRu.stem(word)
      }
      break
    case 'sv':
      if (stemmer === 'porter') {
        return natural.PorterStemmerSv.stem(word)
      }
      break
    default:
      break
  }

  throw new Error(`unsupported stemmer "${stemmer}" and language "${language}" combination`)
}