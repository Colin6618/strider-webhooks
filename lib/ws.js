var io = require('socket.io-client');

// var job = io.connect('http://10.2.84.234:3008/job')
var job = io.connect('http://mex.meizu.com:3008/job')

job.on('connect', function () {
  console.log('job connected');
  // job.emit('job.status.tested', {
  //   v1: 'haha23'
  // })
  // setTimeout(function(){
  //   job.close();
  // }, 3000);
});

// job.on('news', function (data) {
//   console.log(data)
// });


module.exports = job;