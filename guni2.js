var WebSocketServer = require('websocket').server;

var http = require('http');

var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello Client/n');
});

server.listen(9220);
console.log('Server running!');

//Erstellen Websocket-Server
wsServer = new WebSocketServer({
    httpServer: server
});

var allConnections = new Array();

//Websocket Anfrageverarbeitung REQUEST
wsServer.on('request', function (request) {
    console.log('WebSocket request');
    console.log(request.httpRequest.headers);
    console.log(request.body);

    connection = request.accept(null, request.origin);
    allConnections.push(connection);

    //Message from client
    connection.on('message', function (message) {
        console.log(JSON.parse(message))
        if (message.type === 'utf8') {
            console.log('message received: ' + message.utf8Data);
            for (var i = 0; i < allConnections.length; i++) {
                if (allConnections[i] != null) {
                    allConnections[i].sendUTF(message.utf8Data);
                }
            }
        }
    });
});
