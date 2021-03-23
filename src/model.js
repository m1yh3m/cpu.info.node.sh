const {cpus, freemem, totalmem} = require('os');
const {red, green} = require('./colors');

function cpusStream(duration, times, cb) {
  let i = 0;
  const id = setInterval(() => {
    console.clear();
    i++; // increment the timer
    cb(cpuInfo());
    if (i >= times) {
      clearInterval(id); // clear interval timer when we have done this times times
    }
  }, duration);
}

const areSame = (cpus, key) => cpus
  .map(c => c[key])
  .every(x => x === cpus[0][key]);

const areAllModelSame = cpus => areSame(cpus, 'model');

function currentMemoryUsage() {
  const total = totalmem();
  const free = freemem(), freepc = Math.floor(free / total * 100);
  const used = total - free, usedpc = Math.ceil(used / total * 100);
  return {
    free, freepc, total, used, usedpc,
    ks: {free: free / 1024, used: used / 1024, total: total / 1024},
    ms: {free: free / 1024 / 1024, used: used / 1024 / 1024, total: total / 1024 / 1024},
    gs: {free: free / 1024 / 1024 / 1024, used: used / 1024 / 1024 / 1024, total: total / 1024 / 1024 / 1024},
    bar: `${red(Array(usedpc).fill('-').join(''))}${green(Array(freepc).fill('-').join(''))}`
  };
}

function cpuInfo() {
  return cpuInfoModel(cpus());
}

function cpuInfoModel(data) {
  const shouldRemoveModel = areAllModelSame(data);
  const memory = currentMemoryUsage();
  const cpus = data.map(i => i.times).map(({user, sys, idle}) => ({user, sys, idle}));
  return {
    model: shouldRemoveModel ? data[0].model : 'Many model.',
    memory,
    cpus
  };
}

module.exports = {
  cpusStream,
  cpuInfo
};
