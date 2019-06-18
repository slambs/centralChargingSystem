var backendFunctions = require('./backendFunctions')

var testResponse = [2,"59","BootNotification",{"firmwareVersion":"1.1.1805.5-EU-2.3.01.22","chargePointModel":"C2EU","chargePointSerialNumber":"C2011601CNRVKAWV","chargePointVendor":"XC"}];
console.log('we get : ',testResponse);

console.log('we reply : ',backendFunctions.generateReply(testResponse));


//send local list
        // if ( count>3 & count <5) {
        //     CustomReply = [2,count.toString(),"SendLocalListRequest",{"version":1,"updateType":"Full","localAuthorizationList":{"idTag":"04574CEA643A80"}}]; 
        //     console.log(CustomReply);
        //      clients[0].ws.send(JSON.stringify(CustomReply));
        // }
        //Check and reply on authorize