import test from 'tape-promise/tape'
import { randomBytes } from 'crypto'
import fs from 'fs-extra'
import * as secureRemove from '../src'
import tmp from 'tempfile'

export default function (method) {
  test(`file not exists (${method})`, async (t) => {
    const tempfile = tmp()
    const errors = {
      polyfill: `ENOENT: no such file or directory, stat '${tempfile}'`,
      shred: `Exit with 1, stderr:\nshred: ${tempfile}: failed to open for writing: No such file or directory\n`
    }

    await secureRemove[method](tempfile).catch((err) => {
      t.true(err instanceof Error)
      t.equal(err.message, errors[method])
    })
  })

  test(`options.iterations is 1, as result data is not same (${method})`, async (t) => {
    const tempfile = tmp()
    let dataOriginal = randomBytes(1024)
    await fs.writeFile(tempfile, dataOriginal)
    await secureRemove[method](tempfile, { iterations: 1, randomSource: '/dev/urandom' })
    const data = await fs.readFile(tempfile)
    t.notEqual(dataOriginal.toString('hex'), data.toString('hex'))
  })

  test(`options.size = 42K (${method})`, async (t) => {
    const tempfile = tmp()
    await fs.writeFile(tempfile, randomBytes(42))
    await secureRemove[method](tempfile, { size: '42K' })
    const stat = await fs.stat(tempfile)
    t.equal(stat.size, 42 * 1024)
  })

  test(`options.remove is true (${method})`, async (t) => {
    const tempfile = tmp()
    await fs.writeFile(tempfile, randomBytes(1024))
    await secureRemove[method](tempfile, { remove: true })
    await fs.stat(tempfile).catch((err) => {
      t.true(err instanceof Error)
      t.equal(err.message, `ENOENT: no such file or directory, stat '${tempfile}'`)
    })
  })

  test(`options.exact and options.zero is true (${method})`, async (t) => {
    const tempfile = tmp()
    await fs.writeFile(tempfile, randomBytes(1024))
    await secureRemove[method](tempfile, { exact: true, zero: true })
    const data = await fs.readFile(tempfile)
    t.equal(data.toString('hex'), new Buffer(1024).fill(0).toString('hex'))
  })
}
