const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const service = new Schema({
  id: { type: ObjectId },
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createAt: { type: String, default: '' },
});

module.exports = mongoose.models.service || mongoose.model('service', service);