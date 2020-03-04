const { cpus } = require('os')

const red = require('@f0c1s/color-red')
const green = require('@f0c1s/color-green')
const yellow = require('@f0c1s/color-yellow')

const areSame = (cpus, key) => cpus.map(c => c[key]).every(x => x === cpus[0][key])
const areAllModelSame = cpus => areSame(cpus, 'model') // model contains speed info. Weird!

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
    let out = shouldRemoveModel ? `Model: ${data[0].model}\n` : ''

    data.forEach(({ times }) => {
      const { user, sys, idle } = times
      out += `user: ${red(user.toString().padStart(10, ' '))} ms;\t\tsys: ${yellow(sys.toString().padStart(10, ' '))} ms;\t\tidle: ${yellow(idle.toString().padStart(10, ' '))} ms\n`
    })

    console.log(out)
  })
}

function bar(duration, times) {
  cpusStream(duration, times, function cpuData(data) {
    const shouldRemoveModel = areAllModelSame(data)
    let out = shouldRemoveModel ? `Model: ${data[0].model}\n` : ''

    data.forEach(({ times }, i) => {
      const { user, sys, idle } = times
      const total = user + sys + idle
      const userpc = Math.floor(user / total * 100)
      const syspc = Math.floor(sys / total * 100)
      const idlepc = Math.floor(idle / total * 100)
      out += `${i + 1}\t${Array(userpc).fill(red('-')).join('')} ${Array(syspc).fill(yellow('-')).join('')} ${Array(idlepc).fill(green('-')).join('')}\n`
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
