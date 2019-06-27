module.exports = {

    generateReply : function(message){
        var replyCounter = 0;
        //initiated by Charging Station
        if (message[2] === "BootNotification") {
            console.log('generating BootNotification reply...');
            return [3, message[1], { "status": "Accepted", "currentTime": new Date().toISOString(), "interval": 60 }]; //fixed Heartbeat Interval

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
            return [3, message[1], { idTagInfo: { "status": "Accepted" } }];
        
        // Initiated by FrontEnd
        // -- Reset
        }else if(message[2] === "Reset"){
            // Check if ID in Backend in the future, or similar
            console.log('Sending Reset to ChargePOint...');
            replyCounter = replyCounter+1;
            return [2, replyCounter.toString(), "Reset", { type: "Hard" }];
        // -- Remote Start Transaction
        }else if(message[2] === "RemoteStartTransactionRequest"){
            // Check if ID in Backend in the future, or similar
            console.log('Sending RemoteStartTransaction to Chargepoint...');
            replyCounter = replyCounter+1;
            return [2, replyCounter.toString(), "RemoteStartTransactionRequest",{"idTag":"6ac32b40","connectorId":1}];
        // -- Remote Stop Transaction
        }else if(message[2] === "RemoteStopTransactionRequest"){
            // Check if ID in Backend in the future, or similar
            console.log('Generating RemoteStopTransaction...');
            replyCounter = replyCounter+1;
            return [2, replyCounter.toString(), "RemoteStopTransactionRequest", { "transactionId": 1}];  
            
        }else{
    
            console.log("Unknown MEssage!!!!");
            console.log("*****");
            console.log(message);
            console.log("*****");
        };
        

    }

}



//Taken from