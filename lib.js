const { cpus, freemem, totalmem } = require('os')

const red = require('@f0c1s/color-red')
const green = require('@f0c1s/color-green')
const yellow = require('@f0c1s/color-yellow')

const areSame = (cpus, key) => cpus.map(c => c[key]).every(x => x === cpus[0][key])
const areAllModelSame = cpus => areSame(cpus, 'model') // model contains speed info. Weird!

function currentMemoryUsage() {
  const total = totalmem()
  const free = freemem(), freepc = Math.ceil(free / total * 100)
  const used = total - free, usedpc = Math.ceil(used / total * 100)
  return { free, freepc, total, used, usedpc, bar: `${red(Array(usedpc).fill('-').join(''))}${green(Array(freepc).fill('-').join(''))}` }
}

function cpusStream(duration, times, cb) {
  let i = 0
  const id = setInterval(() => {
    console.clear()
    i++ // increment the timer
    cb(cpus())
    if (i >= times) {
      clearInterval(id) // clear interval timer when we have done this times times
    }
  }, duration)
}

function clean(duration, times) {
  cpusStream(duration, times, function cpuData(data) {
    const shouldRemoveModel = areAllModelSame(data)
    const memory = currentMemoryUsage()
    console.log(shouldRemoveModel ? `Model: ${data[0].model}` : '')
    console.log(`MEM: used: ${red(memory.used)}, free: ${green(memory.free)}, total: ${memory.total}`)
    let out = 'cpus\n'
    data.forEach(({ times: cputimes }, i) => {
      const { user, sys, idle } = cputimes

      out += `${i + 1}:\tuser: ${red(user.toString().padStart(10, ' '))} ms;\t\tsys: ${yellow(sys.toString().padStart(10, ' '))} ms;\t\tidle: ${yellow(idle.toString().padStart(10, ' '))} ms\n`
    })

    console.log(out)
  })
}

function bar(duration, times) {
  cpusStream(duration, times, function cpuData(data) {
    const shouldRemoveModel = areAllModelSame(data)
    const memory = currentMemoryUsage()
    console.log(shouldRemoveModel ? `Model: ${data[0].model}` : '')
    console.log(`MEM: used: ${red(memory.used)}, free: ${green(memory.free)}, total: ${memory.total}`)
    console.log(`MEM\t${memory.bar}`)

    let out = 'cpus\n'
    data.forEach(({ times: cputimes }, i) => {
      const { user, sys, idle } = cputimes
      const total = user + sys + idle
      const userpc = Math.ceil(user / total * 100)
      const syspc = Math.ceil(sys / total * 100)
      const idlepc = Math.ceil(idle / total * 100)
      out += `${i + 1}\t${Array(userpc).fill(red('-')).join('')}${Array(syspc).fill(yellow('-')).join('')}${Array(idlepc).fill(green('-')).join('')}\n`
    })
    console.log(out)
  })
}

function raw(duration, times) {
  cpusStream(duration, times, function cpuData(data) {
    console.log(data)
  })
}

module.exports = {
  clean,
  raw,
  bar,
  cpusStream
}
