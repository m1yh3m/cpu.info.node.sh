const {cpuInfo} = require('@f0c1s/cpu.info.node.lib');

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

module.exports = {
    cpusStream
};
