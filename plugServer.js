console.log('Plug cOnTrOl started...');

// importing dependencies
var WebSocket = require('ws');
var uuid = require('node-uuid');
var chargeLogs = require('./database');

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
        //store Message to db
        //
        
        //
        //
        answerMessage = JSON.parse(message); // turn the string into a json
        var chargeLog1 = new chargeLogs({
            MessageTypeId: answerMessage[0],
            UniqueId: answerMessage[1],
            Action: answerMessage[2],
            Payload: answerMessage[3]});
        
          chargeLog1.save(function (err,chargeLog1) {
            if (err) return console.error(err);
            console.log('Entry saved!');
          });
          
        


        // Boot Notification Check and reply
        if (answerMessage[2]==="BootNotification"){
            console.log('Sending BootNotification Reply...')
            bootReply =[3,answerMessage[1],{"status":"Accepted","currentTime":new Date().toISOString(),"interval":30}];
            clients[0].ws.send(JSON.stringify(bootReply));
            console.log(bootReply);
            };
        // strange 70s StartTransaction check and reply
        if (answerMessage[2]==="StartTransaction"){
            console.log('Sending StartTransaction reply...');
            StartReply =[3,answerMessage[1],{"status":"Accepted"}];
            console.log(StartReply);
            clients[0].ws.send(JSON.stringify(StartReply));
            };
        //Heartbeat check and reply
        if (answerMessage[2]==="Heartbeat"){
            console.log('Sending Heartbeat reply...');
            HeartReply =[3,answerMessage[1],{"currentTime":new Date().toISOString()}];
            console.log(HeartReply);
            clients[0].ws.send(JSON.stringify(HeartReply));
        };

        //Check and reply on authorize
        if (answerMessage[2]=="Authorize"){
            console.log('Sending Authorize reply...');
            AuthReply =[3,answerMessage[1],{idTagInfo:{"status":"Accepted"}}];
            console.log(AuthReply);
            clients[0].ws.send(JSON.stringify(AuthReply));

        }
        
        // Display received message, time and a separator
        console.log('Received Message: %s', message);
        console.log('TimeStamp : ',Date());
        console.log('##################################');
        
       
    });

    ws.on('close', function () {
       console.log(' sock closed');
    });
    process.on('SIGINT', function () {
        console.log("Closing things");
        process.exit();
    });
});

// to do - Sanity Check for the 70s - Start Transaction Request

