/* globals it, describe */

var JsPerf = require('../lib/jsperf');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var nock = require('nock');

describe('JS PERF', function() {
  it('should work', function(done) {
    this.timeout(0);
    var testCase = 'replace-vs-split-join-vs-replaceall';
    var rev = '67';
    var inst = new JsPerf(testCase, rev);
    var scope = nock('https://jsperf.com')
      .get(`/${testCase}/${rev}`)
      .reply(200, fs.readFileSync('./test/test-page.html', 'utf-8'));
    inst
      .get()
      .then(() => {
        inst
          .run()
          .then(done)
          .catch(done);
      });
  });

  it('should find missing setup pieces', function(done) {
    this.timeout(0);
    var testCase = 'regexp-test-vs-match-m5';
    var rev = '24';
    var inst = new JsPerf(testCase, rev);
    var scope = nock('https://jsperf.com')
      .get(`/${testCase}/${rev}`)
      .reply(200, fs.readFileSync('./test/test-page2.html', 'utf-8'));
    inst
      .get()
      .then(() => {
        inst
          .run()
          .then(done)
          .catch(done);
      });
  });
});
