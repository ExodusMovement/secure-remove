require('babel-register')
const testsuite = require('./testsuite')

// if (process.platform === 'darwin') testsuite('srm')
if (process.platform === 'linux') testsuite('shred')
// if (process.platform === 'win32') testsuite('sdelete')

testsuite('polyfill')
