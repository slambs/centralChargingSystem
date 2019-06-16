var backendFunctions = require('./backendFunctions')

var testResponse = [2,"59","BootNotification",{"firmwareVersion":"1.1.1805.5-EU-2.3.01.22","chargePointModel":"C2EU","chargePointSerialNumber":"C2011601CNRVKAWV","chargePointVendor":"XC"}];
console.log('we get : ',testResponse);

console.log('we reply : ',backendFunctions.generateReply(testResponse));