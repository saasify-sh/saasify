import * as natural from 'natural'
import * as fs from 'fs'

// TODO: this syntax seems to break `now dev`
// Possibly add esModuleInterop / jsModuleInterop to FTS tsconfig for default imports
import wordListPath = require('word-list')

const words = fs.readFileSync(wordListPath, 'utf8').split('\n')
const spellchecker = new natural.Spellcheck(words)

export function spellcheck (word: string, maxDistance = 2): Boolean | string[] {
  if (maxDistance === 0) {
    return spellchecker.isCorrect(word)
  } else {
    return spellchecker.getCorrections(word, maxDistance)
  }
}