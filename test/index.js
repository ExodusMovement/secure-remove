import testsuite from './testsuite'

// if (process.platform === 'darwin') testsuite('srm')
if (process.platform === 'linux') testsuite('shred')
// if (process.platform === 'win32') testsuite('sdelete')

testsuite('polyfill')
