'use strict';

var http = require('http'),
    httpProxy = require('http-proxy'),
    request = require('request').defaults({jar: true}),
    cfg = require('./map-urls-config.json');


var map = cfg.map || [];

//
// Create your proxy server
//
httpProxy.createServer(9000, 'localhost').listen(8887);

//
// Create your target server
//
http.createServer(function (req, res) {

  var url = req.url;
  console.log('proxy url ' + url + '\n');
  var opts = {
    url : url
  };

  map.forEach(function (entry) {
    if (entry.from && entry.to) {
      if(url.indexOf(entry.from) > -1) {
        url = url.replace(entry.from, entry.to);
        console.log('mapped url to ' + url + '\n');
        //req.url = url;
        opts.url = url;
        opts.headers = req.headers;
        console.log(opts.headers);  
      }
    }
  });

  // this preserves headers and everything
  var x = request(opts);
  req.pipe(x);
  x.pipe(res);

  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  // console.log(req);
  // res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  // res.end();
}).listen(9000);