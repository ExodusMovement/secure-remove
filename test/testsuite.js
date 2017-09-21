import test from 'tape-promise/tape'
import { randomBytes } from 'crypto'
import fs from 'fs'
import * as secureRemove from '../src'
import tmp from 'tempfile'

export default function (method) {
  test(`file not exists (${method})`, (t) => {
    const tempfile = tmp()
    const errors = {
      polyfill: `ENOENT: no such file or directory, stat '${tempfile}'`,
      shred: `Exit with 1, stderr:\nshred: ${tempfile}: failed to open for writing: No such file or directory\n`
    }

    secureRemove[method](tempfile, (err) => {
      t.true(err instanceof Error)
      t.equal(err.message, errors[method])
      t.end()
    })
  })

  test(`options.iterations is 1, as result data is not same (${method})`, (t) => {
    const tempfile = tmp()
    let dataOriginal = randomBytes(1024)
    fs.writeFile(tempfile, dataOriginal, (err) => {
      t.error(err)
      secureRemove[method](tempfile, { iterations: 1, randomSource: '/dev/urandom' }, (err) => {
        t.error(err)
        fs.readFile(tempfile, (err, data) => {
          t.error(err)
          t.notEqual(dataOriginal.toString('hex'), data.toString('hex'))
          t.end()
        })
      })
    })
  })

  test(`options.size = 42K (${method})`, (t) => {
    const tempfile = tmp()
    fs.writeFile(tempfile, randomBytes(42), (err) => {
      t.error(err)
      secureRemove[method](tempfile, { size: '42K' }, (err) => {
        t.error(err)
        fs.stat(tempfile, (err, stat) => {
          t.error(err)
          t.equal(stat.size, 42 * 1024)
          t.end()
        })
      })
    })
  })

  test(`options.remove is true (${method})`, (t) => {
    const tempfile = tmp()
    fs.writeFile(tempfile, randomBytes(1024), (err) => {
      t.error(err)
      fs.writeFileSync(tempfile, randomBytes(1024))
      secureRemove[method](tempfile, { remove: true }, (err) => {
        t.error(err)
        fs.stat(tempfile, (err) => {
          t.true(err instanceof Error)
          t.equal(err.message, `ENOENT: no such file or directory, stat '${tempfile}'`)
          t.end()
        })
      })
    })
  })

  test(`options.exact and options.zero is true (${method})`, (t) => {
    const tempfile = tmp()
    fs.writeFile(tempfile, randomBytes(1024), (err) => {
      t.error(err)
      secureRemove[method](tempfile, { exact: true, zero: true }, (err) => {
        t.error(err)
        fs.readFile(tempfile, (err, data) => {
          t.error(err)
          t.equal(data.toString('hex'), new Buffer(1024).fill(0).toString('hex'))
          t.end()
        })
      })
    })
  })
}
