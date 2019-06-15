
// [<MessageTypeId>, "<UniqueId>", "<Action>", {<Payload>}]
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected!');
  // we're connected!
});

var chargeLogsSchema = new mongoose.Schema({
  MessageTypeId: Number,
  UniqueId: String,
  Action: String,
  Payload: Object
});

var chargeLogs = mongoose.model('chargeLogs',chargeLogsSchema);
//

module.exports = chargeLogs;