const spawn = require('child_process').spawn

function shred (path, options, callback) {
  if (typeof options === 'function' && callback === undefined) {
    callback = options
    options = {}
  }

  const args = []
  options = options || {}
  if (options.force) args.push('--force')
  if (options.iterations) args.push(`--iterations=${options.iterations}`)
  if (options.randomSource) args.push(`--random-source=${options.randomSource}`)
  if (options.size) args.push(`--size=${options.size}`)
  if (options.remove) args.push('--remove')
  if (options.exact) args.push('--exact')
  if (options.zero) args.push('--zero')
  args.push(path)

  const proc = spawn('shred', args, {
    stdio: [ 'ignore', 'ignore', 'pipe' ],
    shell: true
  })

  let stderr = ''
  proc.stderr.on('data', (data) => { stderr += data })

  proc.once('error', callback)
  proc.once('exit', (code) => {
    if (code === 0) return callback(null)
    callback(new Error(`Exit with ${code}, stderr:\n${stderr}`))
  })
}

module.exports = shred
