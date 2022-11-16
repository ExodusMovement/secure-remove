# secure-remove

[![NPM Package](https://img.shields.io/npm/v/secure-remove.svg?style=flat-square)](https://www.npmjs.org/package/secure-remove)
[![Build Status](https://img.shields.io/github/workflow/status/ExodusMovement/secure-remove/CI/master?style=flat-square)](https://github.com/ExodusMovement/secure-remove/actions?query=branch%3Amaster)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## API

### secureRemove(file[, options])

Securely remove a file, using a pure JS implementation.

* `file` (String) - Filepath to securely remove
* `options` (Object)
  * `iterations` (Number) - Overwrite the contents N times instead of the default (3).
  * `randomSource` (String) - Filename to read random bytes from (i.e. `/dev/urandom`). By default, [`crypto.randomBytes()`](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback) is used as the source of random data.
  * `size` (String|Number) - Shred this many bytes (suffixes like K, M, G accepted). By default, all of the file is shredded.
  * `remove` (Boolean) - Truncate and remove file after overwriting. Default `false`.
  * `zero` (Boolean) - Add a final overwrite with zeros to hide shredding. Default `false`.

## LICENSE

MIT
