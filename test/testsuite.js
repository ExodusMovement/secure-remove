const test = require('tape-promise/tape')
const { randomBytes } = require('crypto')
const fs = require('fs').promises
const secureRemove = require('..')
const tmp = require('tempfile')

test(`file not exists`, async (t) => {
  const tempfile = tmp()

  await secureRemove(tempfile).catch((err) => {
    t.true(err instanceof Error)
    t.equal(err.message, `ENOENT: no such file or directory, stat '${tempfile}'`)
  })
})

test(`options.iterations is 1, as result data is not same`, async (t) => {
  const tempfile = tmp()
  let dataOriginal = randomBytes(1024)
  await fs.writeFile(tempfile, dataOriginal)
  await secureRemove(tempfile, { iterations: 1, randomSource: '/dev/urandom' })
  const data = await fs.readFile(tempfile)
  t.notEqual(dataOriginal.toString('hex'), data.toString('hex'))
})

test(`options.size = 42K`, async (t) => {
  const tempfile = tmp()
  await fs.writeFile(tempfile, randomBytes(42))
  await secureRemove(tempfile, { size: '42K' })
  const stat = await fs.stat(tempfile)
  t.equal(stat.size, 42 * 1024)
})

test(`options.remove is true`, async (t) => {
  const tempfile = tmp()
  await fs.writeFile(tempfile, randomBytes(1024))
  await secureRemove(tempfile, { remove: true })
  const exists = await fs.stat(tempfile).catch(err => err)
  t.equal(exists.constructor, Error, 'file should not exist')
  t.equal(exists.code, 'ENOENT', 'file should not exist')
})

test(`options.exact and options.zero is true`, async (t) => {
  const tempfile = tmp()
  await fs.writeFile(tempfile, randomBytes(1024))
  await secureRemove(tempfile, { exact: true, zero: true })
  const data = await fs.readFile(tempfile)
  t.equal(data.toString('hex'), Buffer.alloc(1024).toString('hex'))
})
