#!/usr/bin/env node

const {red} = require('./colors');
const {raw, clean, bar} = require('./lib');

function run(style, duration, times = Infinity) {
    times = times > 0 ? times : Infinity;
    switch (style) {
        case 'raw':
            raw(duration, times);
            break;
        case 'clean':
            clean(duration, times);
            break;
        case 'bar':
            bar(duration, times);
            break;
        default:
            usage();
    }

}

function usage() {
    console.warn(`usage: cpu_info ${red('<style:raw|clean|bar>')} ${red('<duration(in milli-seconds):+number>')} ${red('<times:+number>')}`);
    process.exit(1);
}

if (process.argv.length < 5) {
    usage();
}

const style = process.argv[2];
const duration = process.argv[3];
const times = process.argv[4];

run(style, duration, times);
