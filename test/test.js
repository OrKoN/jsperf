/* globals it, describe */

var JsPerf = require('../lib/jsperf');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var nock = require('nock');

var testCase = 'replace-vs-split-join-vs-replaceall';
var rev = '67';

describe('JS PERF', function() {
  it('should work', function(done) {
    this.timeout(0);
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
});
