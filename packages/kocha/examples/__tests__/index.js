const { execSync } = require('child_process')
const assert = require('power-assert')

describe('simple-pass example', () => {
  it('passes', () => {
    execSync('./packages/kocha/bin/kocha.js ./packages/kocha/examples/simple-pass.js')
  })
})
describe('simple-fail example', () => {
  it('fails', () => {
    assert.throws(() => {
      execSync('./packages/kocha/bin/kocha.js ./packages/kocha/examples/simple-fail.js')
    }, Error)
  })
})
describe('timeout-fail example', () => {
  it('fails', () => {
    assert.throws(() => {
      execSync('./packages/kocha/bin/kocha.js ./packages/kocha/examples/timeout-fail.js')
    }, Error)
  })
})
describe('nested-pass example', () => {
  it('passes', () => {
    execSync('./packages/kocha/bin/kocha.js ./packages/kocha/examples/nested-pass.js')
  })
})
describe('slow-pass example', () => {
  it('passes', () => {
    execSync('./packages/kocha/bin/kocha.js ./packages/kocha/examples/slow-pass.js')
  })
})
describe('babel-pass example', function () {
  this.timeout(3000)
  it('passes', () => {
    execSync('./packages/kocha/bin/kocha.js --require babel-register ./packages/kocha/examples/slow-pass.js')
  })
})
describe('hook-pass example', function () {
  it('passes', () => {
    execSync('./packages/kocha/bin/kocha.js ./packages/kocha/examples/hook-pass.js')
  })
})