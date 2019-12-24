const { cpus } = require('os')

const red = require('@f0c1s/color-red')
const yellow = require('@f0c1s/color-yellow')

const areSame = (cpus, key) => cpus.map(c => c[key]).every(x => x === cpus[0][key])
const areAllModelSame = cpus => areSame(cpus, 'model') // model contains speed info. Weird!

function cpusStream (duration, times, cb) {
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

function clean (duration, times) {
  cpusStream(duration, times, function cpuData (data) {
    const shouldRemoveModel = areAllModelSame(data)
    let out = shouldRemoveModel ? `Model: ${data[0].model}\n` : ''

    data.forEach(({ times }) => {
      const { user, sys, idle } = times
      out += `user: ${red(user.toString().padStart(10, ' '))} ms;\t\tsys: ${yellow(sys.toString().padStart(10, ' '))} ms;\t\tidle: ${yellow(idle.toString().padStart(10, ' '))} ms\n`
    })

    console.log(out)
  })
}
function raw (duration, times) {
  cpusStream(duration, times, function cpuData (data) {
    console.log(data)
  })
}

module.exports = {
  clean,
  raw,
  cpusStream
}
