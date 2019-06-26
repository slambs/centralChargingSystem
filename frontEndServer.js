console.log('Server-side code running');

var $ = require("jquery");

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      open = require('open');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// serve files from the public directory - Dont forget your template files!!!
app.use(express.static('frontEndTemplate'));

// start the express web server listening on 8080
app.listen(8080, () => {
  console.log('listening on 8080');
  open('http://127.0.0.1:8080/index.html');
});


// serve the homepage
app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



