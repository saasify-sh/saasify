import * as natural from 'natural'

export function nGrams (input: string, n: number = 3): string[][] {
  if (n === 2) {
    return natural.NGrams.bigrams(input)
  } else if (n === 3) {
    return natural.NGrams.trigrams(input)
  } else {
    return natural.NGrams.ngrams(input, n)
  }
}