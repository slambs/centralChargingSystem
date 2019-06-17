module.exports = {

    generateReply : function(message){
        if (message[2] === "BootNotification") {
            console.log('generating BootNotification reply...');
            return [3, message[1], { "status": "Accepted", "currentTime": new Date().toISOString(), "interval": 30 }]; //fixed Heartbeat Interval

        }else if (message[2] === "StartTransaction") {
            console.log('generating StartTransaction reply...');
            return [3, message[1], { "status": "Accepted" }];
            
        }else if(message[2] === "Heartbeat") {
            console.log('Generating Heartbeat reply...');
            return [3, message[1], { "currentTime": new Date().toISOString() }];

        }else if(message[2] === "StatusNotification"){
            console.log('Generating StatusNotification reply...');
            return [3, message[1], {}];

        }else if(message[2] === "MeterValues"){
            console.log('Generating MeterValues reply...');
            return [3, message[1], {}];

        }else if(message[2] === "Authorize"){
            // Check if ID in Backend in the future, or similar
            console.log('Generating Authorize reply...');
            return [3, clientMessage[1], { idTagInfo: { "status": "Accepted" } }];

        }else{
            console.log("Unknown MEssage!!!!");
            console.log("*****");
            console.log(message);
            console.log("*****");
        };
        

    }

}