const fs = require('fs/promises')
const { randomBytes } = require('crypto')

async function secureRemove (path, options = {}) {
  let targetFH
  let sourceFH
  const buffer = Buffer.alloc(16384)

  try {
    const stat = await fs.stat(path)
    if (!stat.isFile()) throw new Error(`${path} is not file`)

    let size = stat.size
    if (options.size) {
      const match = options.size.toString().match(/^(\d+)([KMG]?)$/)
      if (match === null) throw new Error(`invalid size: ${options.size}`)
      size = parseInt(match[1], 10) * (
        match[2] === 'K' ? 1024
      : match[2] === 'M' ? 1024 * 1024
      : match[2] === 'G' ? 1024 * 1024 * 1024
      : 1
      )
    }

    let iterations = 3
    if (options.iterations) {
      const match = options.iterations.toString().match(/^\d+$/)
      if (match === null) throw new Error(`invalid iterations: ${options.iterations}`)
      iterations = parseInt(options.iterations, 10)
    }
    if (!(iterations >= 1)) throw new Error(`invalid iterations: ${options.iterations}`)
    if (options.zero) iterations -= 1

    targetFH = await fs.open(path, 'w')
    if (options.randomSource) {
      sourceFH = await fs.open(options.randomSource, 'r')
      let posSource = 0
      for (let i = 0, posTarget = 0; i < iterations; ++i) {
        while (posTarget < size) {
          const required = Math.min(buffer.length, size - posTarget)
          const { bytesRead } = await sourceFH.read(buffer, 0, required, posSource)
          if (bytesRead === 0) throw new Error(`not enough data in ${options.randomSource}`)
          posSource += bytesRead
          const { bytesWritten } = await targetFH.write(buffer, 0, bytesRead, posTarget)
          if (bytesWritten !== bytesRead) throw new Error('lost data on overwrite')
          posTarget += bytesRead
        }
      }

      await sourceFH.close()
      sourceFH = undefined
    } else {
      for (let i = 0; i < iterations; ++i) {
        for (let posTarget = 0; posTarget < size;) {
          const length = Math.min(16384, size - posTarget)
          const buffer = randomBytes(length)
          const { bytesWritten } = await targetFH.write(buffer, 0, length, posTarget)
          if (bytesWritten !== length) throw new Error('lost data on overwrite')
          posTarget += length
        }
      }
    }

    if (options.zero) {
      buffer.fill(0)
      for (let posTarget = 0; posTarget < size;) {
        const length = Math.min(buffer.length, size - posTarget)
        const { bytesWritten } = await targetFH.write(buffer, 0, length, posTarget)
        if (bytesWritten !== length) throw new Error('lost data on overwrite')
        posTarget += length
      }
    }

    await targetFH.close()
    targetFH = undefined

    if (options.remove) await fs.unlink(path)
  } catch (err) {
    await Promise.all(
      [targetFH, sourceFH]
        .filter(i => !!i)
        .map(fh => fh.close().catch(() => {}))
    ).catch(() => {}) // this last catch probably not needed, but never hurts
    throw err
  }
}

module.exports = secureRemove
