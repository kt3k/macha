const { EventEmitter } = require('events')

class TestNode extends EventEmitter {
  /**
   * @param {string} title The title of the test suite
   * @param {boolean} skipped True iff the suite is skipped
   * @param {Suite} parent The parent suite
   */
  constructor (title, skipped, parent) {
    super()

    this.title = title
    this.skipped = skipped
    this.parent = parent
    this.root = parent == null // True if root suite
    this.timeoutDuration = null
  }

  isSkipped () {
    if (this.parent) {
      return this.skipped || this.parent.isSkipped()
    }

    return this.skipped
  }

  /**
   * Bubbles the event to the parent suite.
   * @param {string} event The event name
   * @param {any} arg The argument
   * @param {Error?} err The error object
   */
  bubbleEvent (event, arg, err) {
    if (this.parent) {
      this.parent.bubbleEvent(event, arg, err)
    } else if (err) {
      this.emit(event, arg, err)
    } else if (arg) {
      this.emit(event, arg)
    } else {
      this.emit(event)
    }
  }

  setTimeout (timeout) {
    this.timeoutDuration = timeout
  }

  /**
   * Returns the timeout of the node.
   * @return {number}
   */
  getTimeout () {
    return typeof this.timeoutDuration === 'number' ? this.timeoutDuration : this.parent.getTimeout()
  }

  /**
   * Returns the full title including the parent's title.
   */
  fullTitle () {
    if (this.parent.root) {
      return this.title
    }

    return `${this.parent.fullTitle()} ${this.title}`
  }
}

module.exports = TestNode