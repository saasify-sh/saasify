'use strict'

const pidtree = require('pidtree')
const pMap = require('p-map')

module.exports = async (pid, signal = 'SIGKILL', opts = {}) => {
  const { concurrency = 4 } = opts

  let pids = []

  try {
    pids = await pidtree(pid, {
      root: true
    })
  } catch (err) {
    // ignore if no process is found
    // TODO: don't ignore other pidtree errors
  }

  await pMap(pids, async (pid) => killPID(pid, signal), {
    concurrency
  })

  return pids
}

function killPID(pid, signal) {
  try {
    process.kill(pid, signal)
  } catch (err) {
    if (err.code !== 'ESRCH') {
      throw err
    }
  }
}
