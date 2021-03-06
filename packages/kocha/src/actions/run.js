'use strict'

const path = require('path')
const existsSync = require('fs').existsSync
const ms = require('ms')
const kocha = require('../')
const lookupFilesAll = require('../utils/lookup-files-all')
const lookupFiles = lookupFilesAll.lookupFiles
const color = require('../utils/color')

/**
 * Runs the tests.
 * @param {Object} argv The command line options parsed by minimist
 */
module.exports = argv => {
  if (argv._.length === 0) {
    noInputFilesAndExit()
  }

  // --require
  processRequireOption(argv.require)

  // --config
  processConfigOption(argv.config)

  // --timeout
  processTimeoutOption(argv.timeout)

  const files = lookupFilesAll(argv._, { cwd: process.cwd() })

  if (files.length === 0) {
    noInputFilesAndExit()
  }

  files.forEach(file => {
    require(file)
  })

  const Reporter = require('../reporters/spec')
  new Reporter(kocha.getRunner()) // eslint-disable-line no-new

  kocha.run().then(allPassed => {
    process.exit(allPassed ? 0 : 1)
  }).catch(e => {
    console.log(e)
  })
}

/**
 * Processes --require option
 * @param {string|string[]|undefined} requireOption The require option
 */
const processRequireOption = requireOption => {
  const modules = [].concat(requireOption).filter(Boolean)

  modules.forEach(moduleName => {
    processSingleRequireOption(moduleName)
  })
}

/**
 * Processes --config option
 * @param {?string} config The config path
 */
const processConfigOption = config => {
  if (config) {
    if (!existsSync(config)) {
      showErrorAndExit(`The given config file is not found: ${config}`)
    }

    requireModuleAndShowMessage(path.resolve(process.cwd(), config))
  } else if (existsSync('kocha.config.js')) {
    // Loads default kocha.config.js if exists
    requireModuleAndShowMessage(path.resolve(process.cwd(), 'kocha.config.js'))
  }
}

/**
 * Processes --timeout option
 * @param {?string} timeout The timeout duration
 */
const processTimeoutOption = timeout => {
  if (timeout == null) {
    return
  }

  const duration = ms(timeout)

  if (duration == null) {
    showErrorAndExit(`The timeout duration is invalid: "${timeout}"`)
  }

  console.log(`Setting timeout duration: ${color('cyan', duration + 'ms')}`)
  kocha.timeout(duration)
}

/**
 * Shows error message for no input files and exits.
 */
const noInputFilesAndExit = () => {
  console.log(color('error message', 'Error: ') + 'No input file')
  console.log('See ' + color('cyan', 'kocha -h') + ' for the usage')
  process.exit(1)
}

/**
 * Processes the signle require option path.
 * @param {string} modulePath The module path
 */
const processSingleRequireOption = modulePath => {
  try {
    const resolvedPath = require.resolve(modulePath)

    requireModuleAndShowMessage(resolvedPath)
  } catch (e) {
    const modules = lookupFiles(modulePath, { cwd: process.cwd() })

    if (modules.length > 0) {
      modules.forEach(module => {
        const resolvedPath = path.resolve(module)

        requireModuleAndShowMessage(resolvedPath)
      })
    } else {
      console.log(color('fail', `Error: module not found, ${modulePath}`))
      process.exit(1)
    }
  }
}

/**
 * Requires the module of the resolved path and shows the message.
 * @param {string} resolvedPath The resolved path name
 */
const requireModuleAndShowMessage = resolvedPath => {
  console.log(color('magenta', 'Requiring: ') + resolvedPath)
  require(resolvedPath)
}

/**
 * Shows the error message and exits.
 * @param {string} message The error message
 */
const showErrorAndExit = message => {
  console.log(color('error message', 'Error: ') + message)
  process.exit(1)
}
