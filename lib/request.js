var http = require('http');
var https = require('https');
var url = require('url');

module.exports = function (u, payload) {

  var urlParsed = url.parse(u);
  var opt = {
    method: "post",
    host: urlParsed.host,
    path: urlParsed.path,
    headers: {
      'Content-Type': 'application/json',
      'charset': 'UTF-8'
    }
  };
  var protocol = /^https\:/.test(urlParsed.protocol) ? https : http;
  var req = protocol.request(opt, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('hook return: ' + chunk);
    });
  });
  req.on('error', function (e) {
    console.log('hook problem with request: ' + e.message);
  });

  req.write(JSON.stringify(payload));
  req.end();
}