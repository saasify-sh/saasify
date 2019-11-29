type LivenessStatus = 'alive' | 'dead' | 'invalid'

export interface CheckLinksOptions {
  concurrency?: number
  headers?: { [key: string]: string }
  rejectUnauthorized?: boolean
  timeout?: number
  retries?: number
}

export interface RawLivenessResult {
  status: LivenessStatus
  statusCode?: number
}

export interface LivenessResult extends RawLivenessResult {
  url: string
}
