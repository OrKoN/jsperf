# JSPerf for NodeJS

[![npm version](https://badge.fury.io/js/jsperf.svg)](http://badge.fury.io/js/jsperf)
[![Build Status](http://img.shields.io/travis/OrKoN/jsperf.svg?style=flat)](https://travis-ci.org/OrKoN/jsperf)
[![npm](https://img.shields.io/npm/dm/jsperf.svg)](https://www.npmjs.com/package/jsperf)

This command line utility helps you run performance tests from http://jsperf.com locally with NodeJS.

## Installation

```sh
npm install jsperf -g
```

## Warning

**The tool runs the code fetched from jsperf.com w/o any processing. This can be very dangerous. Review the tests before running or use disposable sandboxes**

This also means that browser-dependant tests will not run (at least with the current version). Fetch only pure JS tests.

## Usage

Create a folder for your local tests:

```sh
mkdir my-jsperf-tests
```

Initialize your tests:

```sh
cd my-jsperf-tests
jsperf init
```

Get a test:

```sh
jsperf get <test-slug> <revision>
```

For instance:

```sh
jsperf get replace-vs-split-join-vs-replaceall 67
```

Preview a test:

```sh
jsperf preview replace-vs-split-join-vs-replaceall 67
```

Run a test:

```sh
jsperf run replace-vs-split-join-vs-replaceall 67
```

Results:

![jsperf results](https://raw.githubusercontent.com/OrKoN/jsperf/master/results.png "jsperf results")

## License

[LICENSE](https://raw.githubusercontent.com/OrKoN/jsperf/master/LICENSE)
