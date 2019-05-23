## Central Charging System
by V.S. 

This is a project that aims to create a simple Tool to control store visualise charging processes for electric cars.
Written in Javascript. And tested on an KEBA P30x - AC Charging Station.

Starting Point:
* OCPP 1.5 
* in Javascript (node.js)
* Keba P30x used for testing.
* central system adress is the http://192.168.0.178:9220 

Update 6.5   /// I can now display some of the messages that Keba sends on the console log
Update 14.5  /// In order to have more control on the wsdl service generated and the I will try strong-soap, found out it is mainly                    for programming clients and only has a mock-server
Update 22.5  /// First test with a new Charging Station (XCharge) over websockets and OCPP 1.6


todos 
-----
- get boot notifications from Charging Station ------------------------------------------------------------ Done
- generate a valid reply :
- think of an App structure
- design the ui and the basic functionalities
- test the whole thing
- write about what you did, how you overcame all these little problems and why you think the code works


notes
------
probably useful links( It may be useful to clean the links from time to time if you don't remember using them)
* node.js http // html ( https://nodejs.org/api/http.html#http_message_rawheaders )
* remember that you can use unsplash to get your 



info/sources(needs cleanup / revision -- bottom of list is newer)
-----
* https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
* https://nodejs.org/api/http.html#http_message_rawheaders
* https://nodejs.org/api/events.html
* https://www.npmjs.com/package/soap ---------------------------------------------------------- Node's Soap Package Info
* https://github.com/strongloop/strong-soap --------------------------------------------------- Strong Soap !!!
* https://github.com/aymen-mouelhi/ocpp-js/blob/master/entities/CentralSystem.js -------------- A similar Project
* https://tools.ietf.org/html/rfc6455 --------------------------------------------------------- Web Socket description
* https://www.ably.io/concepts/websockets ----------------------------------------------------- Article on Web Sockets
* https://hackernoon.com/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8 ------------ Implementing Wb Sockets


installs (needs revision)
------

- npm install express
- npm install body-parser
- npm install express-xml-bodyparser --save
- npm install soap ///
- npm install body-parser
- npm install ws // installs websockets
