# <img src="https://kt3k.github.io/kocha/media/logo.svg" />



![CI](https://github.com/kt3k/kocha/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/kt3k/kocha/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/kocha)
[![npm](https://img.shields.io/npm/v/kocha.svg)](https://npm.im/kocha)


> Modern, simpler Mocha clone, no globals, lint friendly

Supports node.js >= maintained LTS.

# Use in node.js

## :cd: Install

    npm install kocha --save-dev


Require `describe`, `it` etc from kocha, and write tests as in `mocha`:

`test.js`:

```js
const { describe, it } = require('kocha')
const assert = require('assert')

const add = (a, b) => a + b

describe('add', () => {
  it('adds the given numbers', () => {
    const sum = add(12, 13)

    assert(sum === 25)
  })
})
```

Then run it by `kocha` command.

    ./node_modules/.bin/kocha test.js

This outputs the report like the below:

```console
$ ./node_modules/.bin/kocha test.js

add
  ✓ adds the given numbers

  1 passing (4ms)
```

# Use in [karma][karma]

## :cd: Install

    npm install kocha karma-kocha --save-dev

Init karma.conf.js by invoking `karma init` command and following the instructions.

Then add `kocha` configs to `karma.conf.js` like the below:

```js
module.exports = config => config.set({
  frameworks: ['kocha', 'browserify'],
  files: [
    'test/**/*.js'
  ],
  preprocessors: {
    'test/**/*.js': 'browserify'
  }
  browserify: {
    debug: true,
    ...
  },
  ...
})
```

And write the tests like the below:

`test/add.js`:

```js
const { describe, it } = require('kocha')
const assert = require('assert')

const add = (a, b) => a + b

describe('add', () => {
  it('adds the given numbers', () => {
    const sum = add(12, 13)

    assert(sum === 25)
  })
})
```

Then hit the command `karma start`:

    karma start

It outputs the test result like the below:

```console
$ karma start
07 06 2017 13:41:07.792:INFO [framework.browserify]: bundle built
07 06 2017 13:41:07.809:INFO [karma]: Karma v1.7.0 server started at http://0.0.0.0:9876/
07 06 2017 13:41:07.809:INFO [launcher]: Launching browser Chrome with unlimited concurrency
07 06 2017 13:41:07.819:INFO [launcher]: Starting browser Chrome
07 06 2017 13:41:09.349:INFO [Chrome 58.0.3029 (Mac OS X 10.12.5)]: Connected on socket Qs7TxwAJjfsy7LElAAAA with id 79520559
Chrome 58.0.3029 (Mac OS X 10.12.5): Executed 1 of 1 SUCCESS (0.007 secs / 0.001 secs)
```

That's it.

**Note**: You need a CommonJS bundler (typically `browserify` or `webpack`) to use kocha in karma.

**Note**: If you use [babel][babel] together with the bundler, then import `describe`, `it` etc like the below:

```js
import { describe, it } from 'kocha'

describe('foo', () => { ... })
```

# APIs

```js
const {
  describe,
  it,
  before,
  beforeEach,
  after,
  afterEach,
  timeout,
  retries
} = require('kocha')
```

## describe(title, callback)

Adds the test suite by the `title` and `callback`. In `callback` function you can add child test suites and/or test cases.

**Note**: The alias `context(title, callback)` is also available.

## describe.skip(title, callback)

Adds the skipped test suite by the `title` and `callback`. The test suites and cases under this suite are all skipped as well.

**Note**: The alias `xdescribe(title, callback)` and `xcontext(title, callback)` are also available.

## it(title, callback)

Adds the skipped test case by the `title` and `callback`. `callback` implements your test case.

**Note**: The alias `specify(title, callback)` is also available.

## it.skip(title, callback)

Adds the skipped test case by the `title` and `callback`.

**Note**: The alias `xit(title, callback)` and `xspecify(title, callback)` is also available.

## before(callback)

Adds the before hook to the current suite.

## beforeEach(callback)

Adds the beforeEach hook to the current suite.

## after(callback)

Adds the after hook to the current suite.

## afterEach(callback)

Adds the afterEach hook to the current suite.

## timeout(timeout)

Sets the timeout duration to the test cases or the test suites.

## retries(n)

Sets the retry count of the test cases or the test suites.

# Kocha CLI

```
Usage: kocha [options] <file[, ...files]>

Options:
  -h, --help                Shows the help message
  -v, --version             Shows the version number
  -r, --require <name>      Requires the given module e.g. --require @babel/register
  -c, --config <path>       Specify the config file path e.g. --config kocha.e2e.config.js
  -t, --timeout <ms>        Sets the test-case timeout in milliseconds. Default is 2000.

Examples:
  kocha test/               Runs all the tests under test/.

  kocha "src{/,**/}__tests__/**/*.js"
                            Runs tests under the directory pattern src/**/__tests__/.

  kocha --require @babel/register --require @babel/polyfill test/
                            Runs tests under test/ using @babel/register and @babel/polyfill.

  kocha --require coffee-script/register "test/**/*.coffee"
                            Runs coffeescript tests under test/.
```

## kocha.config.js

kocha command automatically looks up `kocha.config.js` from the current directory and execute it. You can configure the test runner there.

kocha.config.js:

```js
const { timeout, retries } = require('kocha')

timeout(5000) // Sets the default timeout to 5000ms
retries(2) // Sets the default retry count to 2

// Other preparations

// For example, babel settings
require('@babel/register')
require('@babel/polyfill')

// For example, power-assert settings
require('espower-loader')({
  pattern: 'test/**/*.js'
})

// For example, coffee-script settings
require('coffee-script/register')
```

# Goals

- Support BDD mode, Spec reporter of [mocha][mocha] in CommonJS environment.
  - This includes Karma environment with CommonJS bundler (browserify, webpack).
- Keeping the basic usability of Mocha, modernize the rusty old aspects of Mocha.

## Non-goals

- Kocha isn't a drop-in replacement of [mocha][mocha].
- Kocha doesn't support interfaces other than `BDD`, like `TDD`, `QUnit`, `Exports` etc
- Kocha doesn't support standalone mode in browser. Use bundlers and [karma][karma] for browser unit testing.
- Kocha's BDD interface is not identical to Mocha's BDD interface. See the below for details.

# Differences from mocha

## BDD interface

- Kocha doesn't have `this.timeout(ms)` API. Use `kocha.timeout(ms)` API instead.
- Kocha doesn't have `this.retries(n)` API. Use `kocha.retries(n)` API instead.

## CLI

- Kocha doesn't support `--opts` option and `mocha.opts` (or `kocha.opts`). Write options directly instead.
- Kocha doesn't support `-w, --watch` option. Use `chokidar-cli` and run-scripts instead.
- Kocha doesn't support `--compilers` option. Use `--require` instead.

# Migration from mocha

## For node.js

1. Install `kocha`
1. Use `kocha` command instead of `mocha` or `_mocha` command.
1. Add `const { describe, it, ... } = require('kocha')` statement on the top of each mocha test script.
1. Rewrite `this.timeout(N)` to `kocha.timeout(N)` if you have any.
1. Rewrite `this.retries(N)` to `kocha.retries(N)` if you have any.
1. Then your tests should work with kocha.

If the above doesn't work, please file an issue.

## For [karma][karma]

1. Install `karma-kocha` and `kocha`
1. Set `framework: ['kocha', ...]` instead of `framework: ['mocha', ...]`.
1. Introduce a bundler (`browserify` or `webpack`) if don't have any.
1. Add `const { describe, it, ... } = require('kocha')` statement on the top of each mocha test script.
1. Rewrite `this.timeout(N)` to `kocha.timeout(N)` if you have any.
1. Rewrite `this.retries(N)` to `kocha.retries(N)` if you have any.
1. Then your tests should work with kocha.

If the above doesn't work, please file an issue.

Examples of migration: [1](https://github.com/kt3k/moneybit-app/pull/3/files)

# Name

Kocha (紅茶, pronounced like ko-cha, not like ko-ka) means black tea in Japanese.

# History

- 2017-12-14   v1.9.0   Change handling of --require option.
- 2017-06-20   v1.8.0   Add node v4 support.
- 2017-06-18   v1.7.0   Add kocha.config.js feature. Add --config option.
- 2017-06-17   v1.6.0   Add --timeout option. Input path handling is now similar to mocha.
- 2017-06-12   v1.5.6   Fail when done is called multiple times.
- 2017-06-12   v1.5.5   Add uncaught error handling.
- 2017-06-11   v1.5.4   Improve hook error handling.
- 2017-06-11   v1.5.3   Improve error formatting of karma-kocha.
- 2017-06-10   v1.5.1   Support IE11.
- 2017-06-09   v1.4.0   Support hook events.
- 2017-06-07   v1.3.0   Add babel's import support.

# License

MIT

[mocha]: https://github.com/mochajs/mocha
[babel]: https://babeljs.com/
[karma]: https://github.com/karma-runner/karma
