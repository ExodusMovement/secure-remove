import fs from 'fs'
import tempfile from 'tempfile'

export function withTempfile (fn) {
  return (t) => {
    t.tempfile = tempfile()

    const end = t.end
    t.end = function () {
      try {
        fs.unlinkSync(t.tempfile)
      } catch (err) {
        if (err.code !== 'ENOENT') console.error(err)
      }

      end.apply(t, arguments)
    }

    try {
      fn(t)
    } catch (err) {
      t.end(err)
    }
  }
}
