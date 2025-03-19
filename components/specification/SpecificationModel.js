const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const specification = new Schema({
    id: { type: ObjectId },
    user_id: { type: ObjectId, ref: 'user' },
    vehicle: [
        {
            vehicle_id: { type: ObjectId, ref: 'vehicle' }
        }
    ],
    port_id: { type: ObjectId, ref: 'port' },
    kw: { type: Number, default: '' },
    slot: { type: Number, default: '' },
    price: { type: Number, default: '' },
    type: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createAt: { type: String, default: '' },
});

module.exports = mongoose.models.specification || mongoose.model('specification', specification);