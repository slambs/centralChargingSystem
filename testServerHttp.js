const http = require('http');
const fileSystem = require('fs');


const hostname = 'localhost';
const port = 9016;
const bootReply = require('./OCPP16/OCPP1.6Schema/json/BootNotificationResponse.json');
const replyboot = {   
};


const server = http.createServer((req, res) => {
    console.log(req);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify(bootReply));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);

});