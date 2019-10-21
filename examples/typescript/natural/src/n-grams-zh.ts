import * as natural from 'natural'

export function nGramsZH (input: string, n: number = 3): string[][] {
  if (n === 2) {
    return natural.NGramsZH.bigrams(input)
  } else if (n === 3) {
    return natural.NGramsZH.trigrams(input)
  } else {
    return natural.NGramsZH.ngrams(input, n)
  }
}