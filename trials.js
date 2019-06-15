
// [<MessageTypeId>, "<UniqueId>", "<Action>", {<Payload>}]
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected!');
  // we're connected!
});

var ChargePointSchema = new mongoose.Schema({
  MessageTypeId: Number,
  UniqueId: String,
  Action: String,
  Payload: Object
});

var ChargePoints = mongoose.model('ChargePoints', ChargePointSchema);

var ChargePoint1 = new ChargePoints({
  MessageTypeId: 2,
  UniqueId: "67",
  Action: "BootNotification",
  Payload: { "firmwareVersion": "1.1.1805.5-EU-2.3.01.22", "chargePointModel": "C2EU", "chargePointSerialNumber": "C2011601CNRVKAWV", "chargePointVendor": "XC" }
});
console.log(ChargePoint1.Payload); //
console.log(ChargePoints);