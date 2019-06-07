console.log('App started');

// importing dependencies

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const crypto = require('crypto');

const bootReply = require('./OCPP16/OCPP1.6Schema/json/BootNotificationResponse.json');
const guid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" //globally unique identifier

const wss = new WebSocket.Server({ port: 9016});

wss.on('connection', function connection(ws,req,res) {
    
    ws.on('message', function incoming(message) {
        console.log('received: %s', message); // files received by the charging station
        console.log(req.headers);              //show headers
        const answer = message;
        const key = req.headers['sec-websocket-key']; //saves the header-key of the request in a separate variable
        const s = key + guid;                             //crypto stuff RFC6455
        const sha = crypto.createHash('sha1');          //crypto stuff RFC6455
        sha.update(s);                                  //crypto stuff RFC6455
        const ret = sha.digest('base64');               //crypto stuff RFC6455
        console.log('Concat String:'+ret);
        console.log(key);
        server.handleUpgrade();
    ws.on('headers',function(key,req){console.log(key,req)});
        
    });
 // the next thing you need to do is: use the http module to modify the headers and send
 // a response to the charging station using the pre-packaged occp 1.6 replies.
    console.log()
    ws.send('hi');

});









