var proxyPort = 80;
var http = require('http');
var httpProxy = require('http-proxy');

http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(4000); //the server object listens on port 8080

var options = {
    router: {
        'localhost':'http://plug.control'
    }
};
console.log('Proxy Routing:');
console.log(options);
console.log();

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(proxyPort);
console.log('Proxy listening on port ' + proxyPort);