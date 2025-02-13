const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const vehicle = new Schema({
  id: { type: ObjectId, ref: 'vehicle' },
  name: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createAt: { type: String, default: '' },
});

module.exports = mongoose.models.vehicle || mongoose.model('vehicle', vehicle);