//testing my RFC6455 websocket key generation function
const crypto = require('crypto');

function generateAcceptValue (acceptKey) {
    return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
  }


// test if the output is correct OCPP1.6 specifications Page 10


console.log(generateAcceptValue('dGhlIHNhbXBsZSBub25jZQ=='));