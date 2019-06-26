// first Trial with express
var express = require('express'); // server
var xmlparser = require('express-xml-bodyparser'); //used to parse the body of the request
var soap = require('soap');
var fs = require('fs');




var app = express();
app.use(xmlparser());




app.get('/', function (req, res) {
  res.send('HI');
})

app.post('/', function (req, res) {
  //console.log(req.headers)
  
  console.log(req.body);
  res.send('What');
})

// Bind webserver to port and start
app.listen(9016, function () {

  console.log('Server started at port 9016');
});
