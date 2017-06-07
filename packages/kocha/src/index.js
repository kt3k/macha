const TestSuite = require('./test-suite')
const TestCase = require('./test-case')
const TestRunner = require('./test-runner')

let runner

/**
 * Gets the runner.
 * @return {TestRunner}
 */
const getRunner = exports.getRunner = () => runner

/**
 * Resets the runner.
 */
exports.resetRunner = () => { runner = new TestRunner() }
exports.resetRunner()

const addSuite = (title, cb, skipped) => {
  const parent = getRunner().getCurrentSuite()
  const child = new TestSuite(title, skipped, parent)

  parent.addSuite(child)

  getRunner().setCurrentSuite(child)

  cb()

  getRunner().setCurrentSuite(parent)
}

const addTest = (title, cb, skipped) => {
  const currentSuite = getRunner().getCurrentSuite()
  currentSuite.addTest(new TestCase(title, cb, skipped, currentSuite))
}

/**
 * Adds the test suite by the name and factory method.
 * @param {string} title The title of the suite.
 * @param {Function} cb The factory of subnodes
 */
exports.describe = exports.context = (title, cb) => {
  addSuite(title, cb, false)
}

/**
 * Adds the skipped test suite by the name and factory method.
 * @param {string} title The title of the suite.
 * @param {Function} cb The factory of subnodes
 */
exports.describe.skip = exports.xdescribe = (title, cb) => {
  addSuite(title, cb, true)
}

/**
 * Adds the test case by the name and test case function.
 * @param {string} title The title of the test case
 * @param {Function} cb The test case function
 */
exports.it = exports.specify = (title, cb) => {
  addTest(title, cb, false)
}

/**
 * Adds the skipped test case by the name and test case function.
 * @param {string} title The title of the test case
 * @param {Function} cb The test case function
 */
exports.it.skip = exports.xit = (title, cb) => {
  addTest(title, cb, true)
}

exports.before = cb => {
  getRunner().getCurrentSuite().setBeforeCb(cb)
}

exports.beforeEach = cb => {
  getRunner().getCurrentSuite().setBeforeEachCb(cb)
}

exports.after = cb => {
  getRunner().getCurrentSuite().setAfterCb(cb)
}

exports.afterEach = cb => {
  getRunner().getCurrentSuite().setAfterEachCb(cb)
}

exports.timeout = timeout => {
  getRunner().getCurrentNode().setTimeout(timeout)
}

exports.retries = n => {
  getRunner().getCurrentNode().setRetryCount(n)
}

exports.TestSuite = TestSuite
exports.TestCase = TestCase
exports.TestRunner = TestRunner

// Pretends to be ESM for transform-es2015-modules-commonjs
exports.__esModule = true

// Exports all as default
// This enables `import kocha from 'kocha'` in babel.
exports.default = exports

// Expose window.__kocha__ if the environment is browser
// This is for karma environment
if (typeof window === 'object') {
  window.__kocha__ = exports
}
