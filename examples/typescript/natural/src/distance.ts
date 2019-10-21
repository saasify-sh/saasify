import * as natural from 'natural'

type DistanceAlgorithm = 'hamming' | 'jaro-winkler' | 'levenshtein' | 'damerau-levenshtein' | 'dice-coefficient'

declare module 'natural' {
  function HammingDistance(s1: string, s2: string, dt?: number): number;
  function DamerauLevenshteinDistance(s1: string, s2: string, dt?: number): number;
}

export function distance (s1: string, s2: string, algo: DistanceAlgorithm = 'levenshtein'): number {
  switch (algo) {
    case 'hamming':
      return natural.HammingDistance(s1, s2)
    case 'jaro-winkler':
      return natural.JaroWinklerDistance(s1, s2)
    case 'levenshtein':
      return natural.LevenshteinDistance(s1, s2)
    case 'damerau-levenshtein':
      return natural.DamerauLevenshteinDistance(s1, s2)
    case 'dice-coefficient':
      return natural.DiceCoefficient(s1, s2)
    default:
      throw new Error(`invalid distance algo "${algo}"`)
  }
}