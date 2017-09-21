import promisifyAll from 'es6-promisify-all'
import fs from 'fs'
import randomBytes from 'randombytes'

const fsa = promisifyAll(fs)

export default function polyfill (path, options, callback) {
  if (typeof options === 'function' && callback === undefined) {
    callback = options
    options = {}
  }

  options = options || {}

  let fdTarget
  let fdSource
  const buffer = new Buffer(16384)

  ;(async function () {
    const stat = await fsa.statAsync(path)
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
    if (options.zero) iterations -= 1

    fdTarget = await fsa.openAsync(path, 'w')
    if (options.randomSource) {
      fdSource = await fsa.openAsync(options.randomSource, 'r')
      let posSource = 0
      for (let i = 0, posTarget = 0; i < iterations; ++i) {
        while (posTarget < size) {
          const required = Math.min(buffer.length, size - posTarget)
          const readed = (await fsa.readAsync(fdSource, buffer, 0, required, posSource))[0]
          if (readed === 0) throw new Error(`not enough data in ${options.randomSource}`)
          posSource += readed
          const written = (await fsa.writeAsync(fdTarget, buffer, 0, readed, posTarget))[0]
          if (written !== readed) throw new Error('lost data on overwrite')
          posTarget += readed
        }
      }

      await fsa.closeAsync(fdSource)
      fdSource = undefined
    } else {
      for (let i = 0; i < iterations; ++i) {
        for (let posTarget = 0; posTarget < size;) {
          const length = Math.min(16384, size - posTarget)
          const buffer = randomBytes(length)
          const written = (await fsa.writeAsync(fdTarget, buffer, 0, length, posTarget))[0]
          if (written !== length) throw new Error('lost data on overwrite')
          posTarget += length
        }
      }
    }

    if (options.zero) {
      buffer.fill(0)
      for (let posTarget = 0; posTarget < size;) {
        const length = Math.min(buffer.length, size - posTarget)
        const written = (await fsa.writeAsync(fdTarget, buffer, 0, length, posTarget))[0]
        if (written !== length) throw new Error('lost data on overwrite')
        posTarget += length
      }
    }

    await fsa.closeAsync(fdTarget)
    fdTarget = undefined

    if (options.remove) await fsa.unlinkAsync(path)
  })().then(() => callback(null), (err) => {
    if (fdTarget) fs.close(fdTarget, () => {})
    if (fdSource) fs.close(fdSource, () => {})
    callback(err)
  })
}
