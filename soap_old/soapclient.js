
var soap = require('strong-soap').soap;
// wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
var url = './wsdl/ocpp_centralsystemservice_1.5_final.wsdl';
 
var requestArgs = {
};
 
var options = {};
soap.createClient(url, options, function(err, client) {
  var method = client['B    '];
  method(requestArgs, function(err, result, envelope, soapHeader) {
    //response envelope
    console.log('Response Envelope: \n' + envelope);
    //'result' is the response body
    console.log('Result: \n' + JSON.stringify(result));
  });
});
 