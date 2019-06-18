console.log('Server-side code running');

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// serve files from the public directory
app.use(express.static('public'));

// start the express web server listening on 8080
app.listen(8080, () => {
  console.log('listening on 8080');
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const resetMessage = [ 2, '1', "Reset", { type: "Hard" } ];
 
var sendReset = function() {
    console.log(resetMessage);
  };
  
  app.post('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
    sendReset();
  });