import { spawn } from 'child_process'

export default async function shred (path, options = {}) {
  const args = []
  if (options.force) args.push('--force')
  if (options.iterations) args.push(`--iterations=${options.iterations}`)
  if (options.randomSource) args.push(`--random-source=${options.randomSource}`)
  if (options.size) args.push(`--size=${options.size}`)
  if (options.remove) args.push('--remove')
  if (options.exact) args.push('--exact')
  if (options.zero) args.push('--zero')
  args.push(path)

  return new Promise((resolve, reject) => {
    const proc = spawn('shred', args, {
      stdio: [ 'ignore', 'ignore', 'pipe' ],
      shell: true
    })

    let stderr = ''
    proc.stderr.on('data', (data) => { stderr += data })

    proc.once('error', reject)
    proc.once('exit', (code) => {
      if (code === 0) return resolve()
      reject(new Error(`Exit with ${code}, stderr:\n${stderr}`))
    })
  })
}
