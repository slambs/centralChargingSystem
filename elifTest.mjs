
//starting point from : https://www.npmjs.com/package/ocpp-eliftech


import { OCPPServer, OCPPCommands } from 'ocpp-eliftech';
 
const server = new OCPPServer();
 
server.listen(9220);
 
server.onRequest = async function(command) {
    // Handle different commands
    if (command instanceof OCPPCommands.BootNotification) {
        return {
            status: 'Accepted',
            currentTime: new Date().toISOString(),
            interval: 60
        };
    }
}