// This is where everything runs together
// The Central Charging "PLUG.CONTROL" System

// Starts the server
function startWebSocket() {
    require('./plugServer'); 
  }

 // Starts the user interface
function startFrontEnd() {
    require('./frontEndServer');
  }

// Run WS and Front end one after the other 10 s
// Front end first, because reply gets sent to ws[1] client

setTimeout(startFrontEnd, 10000);
setTimeout(startWebSocket, 0);

