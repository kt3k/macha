const TestNode = require('./test-node')
const { runCbWithTimeout } = TestNode

class TestCase extends TestNode {
  /**
   * @param {string} title The title of the test case
   * @param {Function} test The function which implements the test case
   * @param {boolean} skipped True iff the case is skipped
   * @param {TestSuite} parent The parent suite
   */
  constructor (title, test, skipped, parent) {
    super(title, skipped, parent)

    this.test = test
    this.pending = true
    this.startedAt = 0
    this.endedAt = 0
    this.duration = 0
  }

  /**
   * Returns the timeout duration of the test.
   * @return {number}
   */
  timeout () {
    return this.getTimeout()
  }

  fail (e) {
    this.calcDuration()
    this.pending = false
    this.bubbleEvent('fail', this, e)
    this.end()
  }

  pass () {
    this.calcDuration()
    this.pending = false
    this.bubbleEvent('pass', this)
    this.end()
  }

  skip () {
    this.calcDuration()
    this.pending = true
    this.bubbleEvent('pending', this)
    this.end()
  }

  calcDuration () {
    this.endedAt = +new Date()
    this.duration = this.endedAt - this.startedAt
  }

  start () {
    this.startedAt = +new Date()
  }

  end () {
    this.bubbleEvent('test end', this)
  }

  /**
   * Returns the threshold number by which the test case is considered slow.
   *
   * I/F for Reporter
   * @return {number}
   */
  slow () {
    return 100
  }

  runCb (cb) {
    const promise = runCbWithTimeout(cb, this.getTimeout())

    return Array(this.getRetryCount()).fill(0).reduce(promise => promise.catch(() => runCbWithTimeout(cb, this.getTimeout())), promise)
  }

  /**
   * Runs the test case.
   * @return {Promise}
   */
  run () {
    this.start()
    if (this.isSkipped()) {
      this.skip()

      return Promise.resolve()
    }

    return this.parent.runBeforeEachCb()
      .then(() => this.runCb(this.test))
      .then(() => { this.pass() }, e => { this.fail(e) })
      .then(() => this.parent.runAfterEachCb())
  }
}

module.exports = TestCase
