import * as natural from 'natural'

const wordnet = new natural.WordNet()

export async function lookup (word: string): Promise<natural.WordNetLookupResults[]> {
  return new Promise((resolve, reject) => {
    wordnet.lookup(word, (results) => {
      resolve(results)
    })
  })
}