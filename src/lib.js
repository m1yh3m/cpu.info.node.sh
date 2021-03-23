const {cpusStream} = require('./model');
const {red, green, yellow} = require('./colors');

function clean(duration, times) {
  let prevCPU = [];
  cpusStream(duration, times, function cpuData({memory, model, cpus}) {
    console.info(`style: clean; duration: ${duration} milliseconds; times: ${times}`);
    console.log(`Model: ${model}`);
    console.log(`MEM: used: ${red(memory.gs.used.toFixed(3))}GB, free: ${green(memory.gs.free.toFixed(3))}GB, total: ${memory.gs.total.toFixed(3)}GB`);
    let out = 'cpus\n';

    cpus.forEach(({user, sys, idle}, i) => {
      if (prevCPU[i]) {
        let {user: puser, sys: psys, idle: pidle} = prevCPU[i];
        user = user - puser;
        sys = sys - psys;
        idle = idle - pidle;
      }
      out += `${i + 1}:\tuser: ${red(user.toString().padStart(5, ' '))} ms;\tsys: ${yellow(sys.toString().padStart(5, ' '))} ms;\tidle: ${green(idle.toString().padStart(5, ' '))} ms\n`;
      prevCPU[i] = {user, sys, idle};
    });

    console.log(out);
  });
}

function bar(duration, times) {

  let prevCPU = [];
  cpusStream(duration, times, function cpuData({memory, model, cpus}) {
    console.info(`style: bar; duration: ${duration} milliseconds; times: ${times}`);
    console.log(`Model: ${model}`);
    console.log(`MEM: used: ${red(memory.gs.used.toFixed(3))}GB, free: ${green(memory.gs.free.toFixed(3))}GB, total: ${memory.gs.total.toFixed(3)}GB`);
    console.log(`MEM\t${memory.bar}`);

    let out = 'cpus\n';
    cpus.forEach(({user, sys, idle}, i) => {
      if (prevCPU[i]) {
        let {user: puser, sys: psys, idle: pidle} = prevCPU[i];
        user = user - puser;
        sys = sys - psys;
        idle = idle - pidle;
      }
      const total = user + sys + idle;
      const userpc = Math.floor(user / total * 100) || 0;
      const syspc = Math.floor(sys / total * 100) || 0;
      const idlepc = Math.ceil(idle / total * 100) || 0;
      out += `${i + 1}\t${Array(userpc).fill(red('-')).join('')}${Array(syspc).fill(yellow('-')).join('')}${Array(idlepc).fill(green('-')).join('')}\n`;
      prevCPU[i] = {user, sys, idle};
    });
    console.log(out);
  });
}

function raw(duration, times) {
  cpusStream(duration, times, data => {
    console.info(`style: bar; duration: ${duration} milliseconds; times: ${times}`);
    console.log(data)
  });
}

module.exports = {
  clean,
  raw,
  bar
};
