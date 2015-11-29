'use strict';

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var beautify = require('js-beautify').js_beautify;
var run = require('./run');
var jsStringEscape = require('js-string-escape');

class JsPerf {

  /**
  @public
  */
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

  /**
  @public
  */
  getTestSource() {
    let content = fs.readFileSync(this.getTestPath(), 'utf-8');
    return content;
  }

  /**
  @public
  */
  get() {
    return this
      .fetch()
      .then(test => this.store(test));
  }

  /**
  @public
  */
  run() {
    var path = this.getTestPath();
    return run(`node ${path}`);
  }

  /**
  the rest is the private API
  @private
  */
  static getScript(page) {
    var $ = cheerio.load(page);
    var scripts = $('script');
    var len = scripts.length;
    var tests = [];
    var setup = `Benchmark.prototype.setup = '{actualSetup}';`;
    for (var i = len - 1; i >= 0 ; i--) {
      if ($(scripts[i]).attr('src')) {
        break;
      }
      var fragment = $(scripts[i]).text();
      if (fragment.indexOf('ui.add') !== -1) {
        tests.push(fragment);
      } else if (fragment.indexOf('Benchmark.prototype.setup') !== -1) {
        setup = fragment;
      } else {
        setup = setup.replace(/\{actualSetup\}/, jsStringEscape(fragment) + '{actualSetup}');
      }
    }
    setup = setup.replace(/\{actualSetup\}/, '');
    return { tests: tests.join('\n'), setup: setup};
  }

  /**
    @private
  */
  static host(host) {
    return host || 'https://jsperf.com';
  }

  /**
    @private
  */
  static dir(dir) {
    return dir || './jsperf.com/';
  }

  /**
    @private
  */
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

  /**
    @private
  */
  store(testData) {
    let dir = path.join(this.path, this.testCase, this.revision);
    let file = path.join(dir, 'test.js');
    mkdirp.sync(dir);
    fs.writeFileSync(file, this.wrapTest(testData), 'utf-8');
  }

  wrapTest(test) {
    test.tests = test.tests.replace(/\.add\(''/, '.add(\'default\'');
    return beautify(`var Benchmark = require('benchmark');
      var ui = new Benchmark.Suite();
      var benchmarks = require('beautify-benchmark')
      ui.browserscope = {};
      var errors = false;
      ${test.setup}
      ${test.tests}
      // add listeners
      ui.on('cycle', function(event) {
        benchmarks.add(event.target)
      })
      ui.on('complete', function() {
        if (!errors) {
          benchmarks.log()
        } else {
          console.error('Errors encountered. Check the source.');
          process.exit(1);
        }
      })
      ui.on('error', function(event) {
        errors =true;
        console.error(event.target.name, event.target.error);
      })
      ui.run({ 'async': true })
      `);
  }

  /**
    @private
  */
  getTestPath() {
    return path.join(this.path, this.testCase, this.revision, 'test.js');
  }
}

module.exports = JsPerf;
