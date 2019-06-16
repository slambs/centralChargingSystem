console.log('Plug cOnTrOl started...');

// importing dependencies
var WebSocket = require('ws');
var uuid = require('node-uuid');
// selfmade
var chargeLogs = require('./database');
var backendFunctions = require('./backendFunctions');

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
        //
        clientMessage = JSON.parse(message); // turn the string into a json
        
        // Generate reply from backendFunctions.js
        reply = backendFunctions.generateReply(clientMessage);
        clients[0].ws.send(JSON.stringify(reply));

    

        //Check and reply on authorize
        if (clientMessage[2] == "Authorize") {
            console.log('Sending Authorize reply...');
            AuthReply = [3, clientMessage[1], { idTagInfo: { "status": "Accepted" } }];
            console.log(AuthReply);
            clients[0].ws.send(JSON.stringify(AuthReply));

        }

        // Display received message, time and a separator
        console.log('Received Message: %s', message);
        console.log('TimeStamp : ', Date());
        console.log('##################################');
       
        //store Message to db
        var chargeLog1 = new chargeLogs({
            MessageTypeId: clientMessage[0],
            UniqueId: clientMessage[1],
            Action: clientMessage[2],
            Payload: clientMessage[3]
        });

        chargeLog1.save(function (err, chargeLog1) {
            if (err) return console.error(err);
            console.log('Entry saved!');
        });

    });

    ws.on('close', function (code, reason) {
        console.log(code);
        console.log(reason);
        console.log('Socket closed!');
    });
    process.on('SIGINT', function () {
        console.log("Closing things");
        process.exit();
    });
});

// to do - Sanity Check for the 70s - Start Transaction Request

