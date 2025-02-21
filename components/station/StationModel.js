const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const station = new Schema({
    id: { type: ObjectId },
    user_id: { type: ObjectId, ref: 'user' },
    brand_id: { type: ObjectId, ref: 'brand' },
    specification: [
        {
            specification_id: { type: ObjectId, ref: 'specification' }
        }
    ],
    service: [
        {
            service_id: { type: ObjectId, ref: 'service' }
        }
    ],
    image: { type: String, default: '' },
    name: { type: String, default: '' },
    location: { type: String, dsefault: '' },
    lat: { type: Number, default: '' },
    lng: { type: Number, default: '' },
    time: { type: String, default: '' },
    note: { type: String, default: '' },
    isActive: { type: Number, default: 1 }, // 1 chờ, 2 đang hoạt dộng, 3 bị hủy, 4 tạm dừng hoạt động
    createAt: { type: String, default: '' },
});

module.exports = mongoose.models.station || mongoose.model('station', station);