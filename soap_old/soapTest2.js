var soap = require('strong-soap').soap;
var WSDL = soap.WSDL;
var path = require('path');
var fs = require('fs');
 
// Pass in WSDL options if any
 
var options = {};
WSDL.open('./wsdl/ocpp_centralsystemservice_1.5_final.wsdl',options,
  function(err, wsdl) {
    // You should be able to get to any information of this WSDL from this object. Traverse
    // the WSDL tree to get  bindings, operations, services, portTypes, messages,
    // parts, and XSD elements/Attributes.




fs.writeFile("temp.txt", wsdl, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
 
    console.log(wsdl.definitions.services.CentralSystemService);
    // print operation name
    
});