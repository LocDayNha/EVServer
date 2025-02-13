const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const port = new Schema({
  id: { type: ObjectId, ref: 'port' },
  name: { type: String, default: '' },
  type: { type: String, default: '' },// AC/DC
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createAt: { type: String, default: '' },
});

module.exports = mongoose.models.port || mongoose.model('port', port);