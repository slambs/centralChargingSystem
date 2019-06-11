console.log('App started');

// importing dependencies
var WebSocket = require('ws');
var uuid = require('node-uuid');
// start web Socket Server on Port xxxx
var WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({ port: 9016 });

// list of connected clients
var clients = [];


// Connection Event
wss.on('connection', function (ws) {
    // create a new uuid
    var client_uuid = uuid.v4();
    // push the variable to the list of clients
    clients.push({ "id": client_uuid, "ws": ws });
    // show the uuid of the connected client
    console.log('client [%s] connected', client_uuid);
    
    // message receiving event
    ws.on('message', function (message) {

        foranswer = JSON.parse(message); // turn the string into a json
        reply =[3,foranswer[1],{"status":"Accepted","currentTime":new Date().toISOString(),"heartbeatInterval":300}];
        console.log('Received Message: %s', message);
        console.log('##################################');
        //console.log(clients[0].ws);
        clients[0].ws.send(JSON.stringify(reply));
    });

    ws.on('close', function () {
       console.log('socket closed');
    });
    process.on('SIGINT', function () {
        console.log("Closing things");
        process.exit();
    });
});