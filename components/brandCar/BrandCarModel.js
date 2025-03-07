const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const brandcar = new Schema({
  id: { type: ObjectId, ref: 'brandCar' },
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createAt: { type: String, default: '' },
});

module.exports = mongoose.models.brandcar || mongoose.model('brandcar', brandcar);