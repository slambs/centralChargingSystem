console.log('Plug cOnTrOl started...');
//############################################
//#### Web Socket Server First ###############
//###########################################

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
// Count OCPP Message Transactions
var count = 0;


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
        console.log(message);
        clientMessage = JSON.parse(message); // turn the string into a json
        // Generate reply from backendFunctions.js
        reply = backendFunctions.generateReply(clientMessage);
        
        clients[0].ws.send(JSON.stringify(reply));
        console.log('REply : ',reply);
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

        count = count+1;
        console.log('OCPP Message count is : ',count);
    });
    ws.on('error',function (params) {
        console.log('error : ', params);
        
    });

    ws.on('close', function (code, reason) {
        console.log(code);
        console.log(reason);
        console.log('Socket closed!');
        //set lamp to false //CSS

    });
    process.on('SIGINT', function () {
        console.log("Closing things");
        process.exit();
    });
});
