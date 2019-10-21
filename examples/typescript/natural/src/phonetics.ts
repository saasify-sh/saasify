import * as natural from 'natural'

type PhoneticAlgo = 'metaphone' | 'sound-ex' | 'double-metaphone'

export function soundsLike (stringA: string, stringB: string, algo: PhoneticAlgo = 'metaphone'): boolean {
  switch (algo) {
    case 'metaphone':
      return natural.Metaphone.compare(stringA, stringB)
    case 'sound-ex':
      return natural.SoundEx.compare(stringA, stringB)
    case 'double-metaphone':
      return natural.DoubleMetaphone.compare(stringA, stringB)
  }
}