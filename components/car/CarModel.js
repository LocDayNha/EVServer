const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const car = new Schema({
  id: { type: ObjectId, ref: 'car' },
  brand_id: { type: ObjectId, ref: 'brandcar' },
  name: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createAt: { type: String, default: '' },
});

module.exports = mongoose.models.car || mongoose.model('car', car);