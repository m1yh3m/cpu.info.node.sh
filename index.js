#!/usr/bin/env node

const program = require('commander')
const lib = require('./lib')

function run (style, duration) {
  /* lib returns {raw(), clean(), bar()}
   * style has two possible values: raw|clean or it calls undefined()
   */
  return lib[style](duration)
}

program
  .arguments('<style> <duration>')
  .action(run)
  .parse(process.argv)
