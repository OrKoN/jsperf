#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var command = argv._[0];
var testCase = argv._[1];
var revision = argv._[2];
var host = argv.host;
var run = require('../lib/run');
var JsPerf = require('../lib/jsperf');
var fs = require('fs');

function printUsage() {
  console.log('Usage: ');
  console.log('    `jsperf init` - initialize the current directory for performance tests');
  console.log('    `jsperf get <test-case-slug> <revision> [--host https://jsperf.com]` - download a test revision from jsperf.com');
  console.log('    `jsperf preview <test-case-slug> <revision> [--host https://jsperf.com]` - output a fetched test revision');
  console.log('    `jsperf run <test-case-slug> <revision> [--host https://jsperf.com]` - run a test revision');
}

switch (command) {
  case 'init':
    fs.writeFileSync('./package.json', `
      {
        "name": "jsperf.com",
        "version": "0.1.0",
        "private": true,
        "description": "Run jsperf.com tests locally with your NodeJS version",
        "dependencies": {
        },
        "devDependencies": {
        }
      }
    `);
    run('npm install benchmark beautify-benchmark --save-dev');
    break;
  case 'get':
    var jsPerf = new JsPerf(testCase, revision.toString(), {
      host: host,
    });
    jsPerf
      .get()
      .then(() => console.log(`Test case ${testCase}v${revision} installed`))
      .catch(err => console.error(`Failed to install test case ${testCase}v${revision}`, err));
    break;
  case 'run':
    var jsPerf = new JsPerf(testCase, revision.toString());
    jsPerf.run();
    break;
  case 'preview':
    var jsPerf = new JsPerf(testCase, revision.toString());
    console.log(jsPerf.getTestSource());
    break;
  default:
    printUsage();
}
