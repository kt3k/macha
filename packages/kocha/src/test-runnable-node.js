const TestNode = require('./test-node')
const { runCb, runCbWithTimeout, throwAfterTimeout } = TestNode

/**
 * The runnable node of the test tree.
 *
 * The parent class of TestCase and TestHook.
 */
class TestRunnableNode extends TestNode {
  /**
   * @param {string} title The title of the runnable node
   * @param {Function} runnable The function which represents the contents of the runnable
   * @param {string} type The type of the runnable node
   * @param {boolean} skipped True iff the runnable node is skipped
   * @param {TestSuite} parent The parent suite
   */
  constructor (title, runnable, type, skipped, parent) {
    super(title, skipped, parent)

    this.type = type
    this.runnable = runnable
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

  start () {
    this.startedAt = +new Date()
    this.getRunner().setRunningNode(this)
    this.bubbleEvent(this.type, this)
  }

  calcDuration () {
    this.endedAt = +new Date()
    this.duration = this.endedAt - this.startedAt
  }

  end () {
    this.getRunner().setRunningNode(null)
    this.bubbleEvent(`${this.type} end`, this)
  }

  /**
   * Returns the threshold number by which the test case is considered slow.
   *
   * I/F for Reporter
   * @return {number}
   */
  slow () {
    return 75
  }

  /**
   * Runs the runnable.
   */
  run () {
    if (!this.runnable) {
      return
    }

    const promise = runCb(this.runnable)
    const timeout = this.getTimeout()
    const retryCount = this.getRetryCount()

    const promiseWithTimeout = Promise.race([promise, throwAfterTimeout(timeout)])

    return Array(retryCount).fill(0).reduce(promise => promise.catch(() => runCbWithTimeout(this.runnable, timeout)), promiseWithTimeout)
  }
}

module.exports = TestRunnableNode