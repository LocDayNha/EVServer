const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const location = new Schema({
    id: { type: ObjectId, ref: 'location' },
    image: { type: String, default: '' },
    name: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createAt: { type: String, default: '' },
});

module.exports = mongoose.models.location || mongoose.model('location', location);