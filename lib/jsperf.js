'use strict';

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var beautify = require('js-beautify').js_beautify;
var run = require('./run');

class JsPerf {

  static getScript(page) {
    var $ = cheerio.load(page);
    var scripts = $('script');
    var len = scripts.length;
    var res = '';
    for (var i = len - 1; i >= 0 ; i--) {
      if ($(scripts[i]).attr('src')) {
        break;
      }
      res += $(scripts[i]).text();
    }
    return res;
  }

  static host(host) {
    return host || 'https://jsperf.com';
  }

  static dir(dir) {
    return dir || './jsperf.com/';
  }

  constructor(testCase, revision, opts) {
    opts = opts || {};
    this.path =  path.normalize(JsPerf.dir(opts.dir));
    this.host = JsPerf.host(opts.host);
    this.testCase = testCase;
    this.revision = revision;
    try {
      fs.mkdirSync(this.path);
    } catch (err) {}
  }

  fetch() {
    const url = `${this.host}/${this.testCase}/${this.revision}`;
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(JsPerf.getScript(body));
      });
    });
  }

  get() {
    return this
      .fetch()
      .then(test => this.store(test));
  }

  store(test) {
    let dir = path.join(this.path, this.testCase, this.revision);
    let file = path.join(dir, 'test.js');
    mkdirp.sync(dir);
    fs.writeFileSync(file, this.wrapTest(test), 'utf-8');
  }

  wrapTest(test) {
    return beautify(`var Benchmark = require('benchmark');
      var ui = new Benchmark.Suite();
      var benchmarks = require('beautify-benchmark')
      ui.browserscope = {};
      ${test}
      // add listeners
      ui.on('cycle', function(event) {
        benchmarks.add(event.target)
      })
      ui.on('complete', function() {
        benchmarks.log()
      })
      ui.run({ 'async': true })
      `);
  }

  getTestPath() {
    return path.join(this.path, this.testCase, this.revision, 'test.js');
  }

  getTestSource() {
    let content = fs.readFileSync(this.getTestPath(), 'utf-8');
    return content;
  }

  run() {
    var path = this.getTestPath();
    return run(`node ${path}`);
  }
}

module.exports = JsPerf;
