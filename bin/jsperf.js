#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var command = argv._[0];
var testCase = argv._[1];
var revision = argv._[2].toString();
var run = require('../lib/run');
var JsPerf = require('../lib/jsperf');
var fs = require('fs');

function printUsage() {
  console.log();
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
    var jsPerf = new JsPerf(testCase, revision);
    jsPerf
      .get()
      .then(() => console.log(`Test case ${testCase}v${revision} installed`))
      .catch(err => console.error(`Failed to install test case ${testCase}v${revision}`, err));
    break;
  case 'run':
    var jsPerf = new JsPerf(testCase, revision);
    jsPerf.run();
    break;
  case 'preview':
    var jsPerf = new JsPerf(testCase, revision);
    console.log(jsPerf.getTestSource());
    break;
  default:
    printUsage();
}
