var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

function run(cmd, pipe) {
  return new Promise(function(resolve, reject) {
    var cmdArr = cmd.split(' ');
    var data = [];
    var child = spawn(cmdArr[0], cmdArr.slice(1),
      {stdio: pipe ? 'pipe' : 'inherit'});

    if (child.stdout) {
      child.stdout.on('data', function(chunk) {
        data.push(chunk.toString('utf-8'));
      });
    }

    child.on('close', function(error) {
      if (!error) {
        resolve(data.join());
      } else {
        reject(error, data.join());
      }
    });
  });
}

module.exports = run;
