console.log('App started');

// importing dependencies

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({port:9220});

wss.on('connection', function connection(ws,req,res) {
    
    ws.on('message', function incoming(message) {

        console.log('Received Message: %s', message); //  show files json received by the charging station
        console.log('Message Headers :',req.headers);            // show the headers sent by the station
        
        foranswer = JSON.parse(message); // turn the string into a json
        reply =[3,foranswer[1],{"status":"Accepted","currentTime":"2013-02-01T20:53:32.486Z","heartbeatInterval":300}];
        //console.log(reply);

        const key = req.headers['sec-websocket-key']; //saves the header-key of the request in a separate variable
        
        //console.log(s);    // What the reply should look like
    

    
    ws.send(reply,
      console.log('Reply by server:',reply)
      );
        
    });
 // the next thing you need to do is: use the http module to modify the headers and send
 // a response to the charging station using the pre-packaged occp 1.6 replies.
    

});











