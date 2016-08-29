require('babel-register')

if (process.platform === 'darwin') require('./srm')
if (process.platform === 'linux') require('./shred')
if (process.platform === 'win32') require('./sdelete')

require('./polyfill')
