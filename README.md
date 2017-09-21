# secure-remove

[![NPM Package](https://img.shields.io/npm/v/secure-remove.svg?style=flat-square)](https://www.npmjs.org/package/secure-remove)
[![Build Status](https://img.shields.io/travis/ExodusMovement/secure-remove.svg?branch=master&style=flat-square)](https://travis-ci.org/ExodusMovement/secure-remove)
[![Dependency status](https://img.shields.io/david/ExodusMovement/secure-remove.svg?style=flat-square)](https://david-dm.org/ExodusMovement/secure-remove#info=dependencies)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# API

* [shred(path[, options], callback)](#)
* [polyfill(path[, options], callback)](#)

##### shred(path[, options])

* `path` - string
* `options` - Object
  * `force` - boolean, change permissions to allow writing if necessary
  * `iterations` - number, overwrite N times instead of the default (3)
  * `randomSource` - string, get random bytes from FILE
  * `size` - string|number, shred this many bytes (suffixes like K, M, G accepted)
  * `remove` - boolean, truncate and remove file after overwriting
  * `exact` - boolean, do not round file sizes up to the next full block; this is the default for non-regular files
  * `zero` - boolean, add a final overwrite with zeros to hide shredding

##### polyfill(path[, options])

* `path` - string
* `options` - Object
  * `iterations` - number, overwrite N times instead of the default (3)
  * `randomSource` - string, get random bytes from FILE
  * `size` - string|number, shred this many bytes (suffixes like K, M, G accepted)
  * `remove` - boolean, truncate and remove file after overwriting
  * `zero` - boolean, add a final overwrite with zeros to hide shredding

## LICENSE

MIT
