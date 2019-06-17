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
        //
        clientMessage = JSON.parse(message); // turn the string into a json
        
        // Generate reply from backendFunctions.js
        reply = backendFunctions.generateReply(clientMessage);
        clients[0].ws.send(JSON.stringify(reply));

        //send local list
        if ( count>3 & count <5) {
            CustomReply = [2,count.toString(),"SendLocalListRequest",{"version":1,"updateType":"Full","localAuthorizationList":{"idTag":"04574CEA643A80"}}]; 
            console.log(CustomReply);
             clients[0].ws.send(JSON.stringify(CustomReply));
        }
        //Check and reply on authorize
        if ( count>5 & count <7 ) {
            CustomReply = [ 2, '1', "Reset", { type: "Hard" } ];
            // my key --> "04574CEA643A80" or "00000000" or "A857C22D"
           // CustomReply = [ 2, stringify(count), "RemoteStartTransaction", { idTag: "" } ];
           //CustomReply = [2,count.toString(),"GetLocalListVersionRequest",{}]; 
           console.log(CustomReply);
            clients[0].ws.send(JSON.stringify(CustomReply));

        }

        // Display received message, time and a separator
        console.log('Received Message: %s', message);
        console.log('TimeStamp : ', Date());
        console.log('##################################');
       
        //store Message to db
        // var chargeLog1 = new chargeLogs({
        //     MessageTypeId: clientMessage[0],
        //     UniqueId: clientMessage[1],
        //     Action: clientMessage[2],
        //     Payload: clientMessage[3]
        // });

        // chargeLog1.save(function (err, chargeLog1) {
        //     if (err) return console.error(err);
        //     console.log('Entry saved!');
        // });

        count = count+1;
        console.log('count is : ',count);
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

