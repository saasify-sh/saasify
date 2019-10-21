import * as natural from 'natural'

type Tokenizer = 'word' | 'word-punct' | 'sentence' | 'case' | 'orthography' | 'treebank' | 'aggressive' | 'aggressive-fa' | 'aggressive-fr'| 'aggressive-ru'| 'aggressive-es'| 'aggressive-it'| 'aggressive-pl'| 'aggressive-pt'| 'aggressive-no'| 'aggressive-sv'| 'aggressive-vi' | 'ja'

declare module 'natural' {
  class SentenceTokenizer implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class CaseTokenizer implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class OrthographyTokenizer implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerFa implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerFr implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerRu implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerEs implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerIt implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerPl implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerPt implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerNo implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerSv implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class AggressiveTokenizerVi implements natural.Tokenizer {
    tokenize(text: string): string[]
  }

  class TokenizerJa implements natural.Tokenizer {
    tokenize(text: string): string[]
  }
}

export function tokenize (text: string, tokenizer: Tokenizer = 'word'): string[] {
  let impl: natural.Tokenizer

  switch (tokenizer) {
    case 'word':
      impl = new natural.WordTokenizer()
      break
    case 'word-punct':
      impl = new natural.WordPunctTokenizer()
      break
    case 'sentence':
      impl = new natural.SentenceTokenizer()
      break
    case 'case':
      impl = new natural.CaseTokenizer()
      break
    case 'orthography':
      impl = new natural.OrthographyTokenizer()
      break
    case 'treebank':
      impl = new natural.TreebankWordTokenizer()
      break
    case 'aggressive':
      impl = new natural.AggressiveTokenizer()
      break
    case 'aggressive-fa':
      impl = new natural.AggressiveTokenizerFa()
      break
    case 'aggressive-fr':
      impl = new natural.AggressiveTokenizerFr()
      break
    case 'aggressive-ru':
      impl = new natural.AggressiveTokenizerRu()
      break
    case 'aggressive-es':
      impl = new natural.AggressiveTokenizerEs()
      break
    case 'aggressive-it':
      impl = new natural.AggressiveTokenizerIt()
      break
    case 'aggressive-pl':
      impl = new natural.AggressiveTokenizerPl()
      break
    case 'aggressive-pt':
      impl = new natural.AggressiveTokenizerPt()
      break
    case 'aggressive-no':
      impl = new natural.AggressiveTokenizerNo()
      break
    case 'aggressive-sv':
      impl = new natural.AggressiveTokenizerSv()
      break
    case 'aggressive-vi':
      impl = new natural.AggressiveTokenizerVi()
      break
    case 'ja':
      impl = new natural.TokenizerJa()
      break
    default:
      throw new Error(`invalid tokenizer "${tokenizer}"`)
  }

  return impl.tokenize(text)
}