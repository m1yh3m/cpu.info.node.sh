#!/usr/bin/env node

const red = require('@f0c1s/color-red')
const lib = require('./lib')

function run(style, duration, times = Infinity) {
  console.info(`style: ${style}; duration: ${duration} milliseconds; times: ${times}`)
  /* lib returns {raw(), clean(), bar()}
   * style has two possible values: raw|clean or it calls undefined()
   */
  return lib[style](duration, times)
}

if (process.argv.length < 4) {
  console.warn(`usage: cpu_info ${red('<style:raw|clean:bar>')} ${red('<duration>')}`)
  process.exit(1)
}

const style = process.argv[2]
const duration = process.argv[3]

run(style, duration)
