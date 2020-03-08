const { cpus, freemem, totalmem } = require('os')

const red = require('@f0c1s/color-red')
const green = require('@f0c1s/color-green')
const yellow = require('@f0c1s/color-yellow')

const areSame = (cpus, key) => cpus.map(c => c[key]).every(x => x === cpus[0][key])
const areAllModelSame = cpus => areSame(cpus, 'model') // model contains speed info. Weird!

function currentMemoryUsage () {
  const total = totalmem()
  const free = freemem(); const freepc = Math.floor(free / total * 100)
  const used = total - free; const usedpc = Math.ceil(used / total * 100)
  return {
    free,
    freepc,
    total,
    used,
    usedpc,
    ks: { free: free / 1024, used: used / 1024, total: total / 1024 },
    ms: { free: free / 1024 / 1024, used: used / 1024 / 1024, total: total / 1024 / 1024 },
    gs: { free: free / 1024 / 1024 / 1024, used: used / 1024 / 1024 / 1024, total: total / 1024 / 1024 / 1024 },
    bar: `${red(Array(usedpc).fill('-').join(''))}${green(Array(freepc).fill('-').join(''))}`
  }
}

function cpusStream (duration, cb) {
  setInterval(() => {
    console.clear()
    cb(cpus())
  }, duration)
}

function clean (duration) {
  const prevCPU = []
  cpusStream(duration, function cpuData (data) {
    const shouldRemoveModel = areAllModelSame(data)
    const memory = currentMemoryUsage()
    console.log(shouldRemoveModel ? `Model: ${data[0].model}` : '')
    console.log(`MEM: used: ${red(memory.gs.used)}GB, free: ${green(memory.gs.free)}GB, total: ${memory.gs.total}GB`)
    let out = 'cpus\n'

    data.forEach(({ times: cputimes }, i) => {
      let { user, sys, idle } = cputimes
      if (prevCPU[i]) {
        const { user: puser, sys: psys, idle: pidle } = prevCPU[i]
        user = user - puser
        sys = sys - psys
        idle = idle - pidle
      }
      out += `${i + 1}:\tuser: ${red(user.toString().padStart(5, ' '))} ms;\tsys: ${yellow(sys.toString().padStart(5, ' '))} ms;\tidle: ${green(idle.toString().padStart(5, ' '))} ms\n`
      prevCPU[i] = cputimes
    })

    console.log(out)
  })
}

function bar (duration) {
  const prevCPU = []
  cpusStream(duration, function cpuData (data) {
    const shouldRemoveModel = areAllModelSame(data)
    const memory = currentMemoryUsage()
    console.log(shouldRemoveModel ? `Model: ${data[0].model}` : '')
    console.log(`MEM: used: ${red(memory.gs.used)}GB, free: ${green(memory.gs.free)}GB, total: ${memory.gs.total}GB`)
    console.log(`MEM\t${memory.bar}`)

    let out = 'cpus\n'
    data.forEach(({ times: cputimes }, i) => {
      let { user, sys, idle } = cputimes
      if (prevCPU[i]) {
        const { user: puser, sys: psys, idle: pidle } = prevCPU[i]
        user = user - puser
        sys = sys - psys
        idle = idle - pidle
      }
      const total = user + sys + idle
      const userpc = Math.floor(user / total * 100) || 0
      const syspc = Math.floor(sys / total * 100) || 0
      const idlepc = Math.ceil(idle / total * 100) || 0
      out += `${i + 1}\t${Array(userpc).fill(red('-')).join('')}${Array(syspc).fill(yellow('-')).join('')}${Array(idlepc).fill(green('-')).join('')}\n`
      prevCPU[i] = cputimes
    })
    console.log(out)
  })
}

function raw (duration) {
  cpusStream(duration, function cpuData (data) {
    console.log(data)
  })
}

module.exports = {
  clean,
  raw,
  bar,
  cpusStream
}
