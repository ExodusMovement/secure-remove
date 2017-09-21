# secure-remove

[![NPM Package](https://img.shields.io/npm/v/secure-remove.svg?style=flat-square)](https://www.npmjs.org/package/secure-remove)
[![Build Status](https://img.shields.io/travis/ExodusMovement/secure-remove.svg?branch=master&style=flat-square)](https://travis-ci.org/ExodusMovement/secure-remove)
[![Dependency status](https://img.shields.io/david/ExodusMovement/secure-remove.svg?style=flat-square)](https://david-dm.org/ExodusMovement/secure-remove#info=dependencies)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## API

### polyfill(file[, options])

Securely remove a file, using a pure JS implementation.

* `file` (String) - Filepath to securely remove
* `options` (Object)
  * `iterations` (Number) - Overwrite the contents N times instead of the default (3).
  * `randomSource` (String) - Filename to read random bytes from (i.e. `/dev/urandom`). By default, [`crypto.randomBytes()`](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback) is used as the source of random data.
  * `size` (String|Number) - Shred this many bytes (suffixes like K, M, G accepted). By default, all of the file is shredded.
  * `remove` (Boolean) - Truncate and remove file after overwriting. Default `false`.
  * `zero` (Boolean) - Add a final overwrite with zeros to hide shredding. Default `false`.

### shred(path[, options])

Remove a file by shelling out to [`shred`](http://www.manpages.info/linux/shred.1.html). **Works on Linux ONLY!**

* `file` (String) - Filepath to securely remove
* `options` (Object)
  * `force` (Boolean) - Change permissions to allow writing if necessary.
  * `exact` (Boolean) - Do not round file sizes up to the next full block; this is the default for non-regular files.
  * _Supports all options supported by `polyfill()`..._

## LICENSE

MIT
