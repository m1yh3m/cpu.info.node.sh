#!/usr/bin/env node

const program = require('commander')
const lib = require('./lib')

function run (style, duration, times = Infinity) {
  console.info(`style: ${style}; duration: ${duration} milliseconds; times: ${times}`)
  /* lib returns {raw(), clean()}
   * style has two possible values: raw|clean or it calls undefined()
   */
  return lib[style](duration, times)
}

program
  .arguments('<style> <duration> <times>')
  .action(run)
  .parse(process.argv)
