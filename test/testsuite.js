const test = require('tape')
const randomBytes = require('crypto').randomBytes
const fs = require('fs')
const secureRemove = require('../src')
const util = require('./util')

module.exports = function (method) {
  test(`file not exists (${method})`, util.withTempfile((t) => {
    const errors = {
      polyfill: `ENOENT: no such file or directory, stat '${t.tempfile}'`,
      shred: `Exit with 1, stderr:\nshred: ${t.tempfile}: failed to open for writing: No such file or directory\n`
    }

    secureRemove[method](t.tempfile, (err) => {
      t.true(err instanceof Error)
      t.equal(err.message, errors[method])
      t.end()
    })
  }))

  test(`options.iterations is 1, as result data is not same (${method})`, util.withTempfile((t) => {
    let dataOriginal = randomBytes(1024)
    fs.writeFile(t.tempfile, dataOriginal, (err) => {
      t.error(err)
      secureRemove[method](t.tempfile, { iterations: 1, randomSource: '/dev/urandom' }, (err) => {
        t.error(err)
        fs.readFile(t.tempfile, (err, data) => {
          t.error(err)
          t.notEqual(dataOriginal.toString('hex'), data.toString('hex'))
          t.end()
        })
      })
    })
  }))

  test(`options.size = 42K (${method})`, util.withTempfile((t) => {
    fs.writeFile(t.tempfile, randomBytes(42), (err) => {
      t.error(err)
      secureRemove[method](t.tempfile, { size: '42K' }, (err) => {
        t.error(err)
        fs.stat(t.tempfile, (err, stat) => {
          t.error(err)
          t.equal(stat.size, 42 * 1024)
          t.end()
        })
      })
    })
  }))

  test(`options.remove is true (${method})`, util.withTempfile((t) => {
    fs.writeFile(t.tempfile, randomBytes(1024), (err) => {
      t.error(err)
      fs.writeFileSync(t.tempfile, randomBytes(1024))
      secureRemove[method](t.tempfile, { remove: true }, (err) => {
        t.error(err)
        fs.stat(t.tempfile, (err) => {
          t.true(err instanceof Error)
          t.equal(err.message, `ENOENT: no such file or directory, stat '${t.tempfile}'`)
          t.end()
        })
      })
    })
  }))

  test(`options.exact and options.zero is true (${method})`, util.withTempfile((t) => {
    fs.writeFile(t.tempfile, randomBytes(1024), (err) => {
      t.error(err)
      secureRemove[method](t.tempfile, { exact: true, zero: true }, (err) => {
        t.error(err)
        fs.readFile(t.tempfile, (err, data) => {
          t.error(err)
          t.equal(data.toString('hex'), new Buffer(1024).fill(0).toString('hex'))
          t.end()
        })
      })
    })
  }))
}
