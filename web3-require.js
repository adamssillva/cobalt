
const Web3 = require('web3')
const assert = require('assert')
const { each, set } = require('lodash')

/**
 * Usage:
 *
 *   const solc = require('bmono/make-solc')(`${__dirname}/../contracts`)
 *   require('bmono/web3-compile-deploy')(solc)
 *
 *   const Web3 = require('web3')
 *   const web3 = new Web3(...)
 *   web3.compile('Foo.sol')
 *   const foo = await web3.deploy('Foo', [], { from, gas })
 *
 * @param {solc} .solc
 */
function make({ root, solc }) {

  // When `root` is defined, construct `solc`.
  if (root) {
    assert(!solc, 'Expected solc to be nil.')
    solc = require('./solc')({ root })
  }

  // At this point, we need to have `solc` defined.
  assert(solc, 'Expected solc (or root) to be set.')

  // Return require function. It needs to be bound to Web3.prototype` or `web3`.
  return function web3Require(filename, { from } = {}) {
    each(solc(filename), ({ abi, bin: data }, key) => {
      set(this, ['ctr', key], new this.eth.Contract(abi, { from, data }))
    })
    return this.ctr
  }

}

module.exports = make
