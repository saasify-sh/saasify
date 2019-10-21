import * as natural from 'natural'

interface ApproxStringMatch {
  substring: string
  distance: number
}

export function approxStringSearch (s1: string, s2: string): ApproxStringMatch {
  return (natural.LevenshteinDistance(s1, s2, { search: true }) as any) as ApproxStringMatch
}