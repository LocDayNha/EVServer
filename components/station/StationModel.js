const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const station = new Schema({
    id: { type: ObjectId },
    user_id: { type: ObjectId, ref: "user" },
    station_id: { type: ObjectId, ref: "station" },
    brand_id: {type: ObjectId, ref: "brand"},
    specification: {type: Array, default:''},
    service: {type: Array, default:''},
    name: {type: String, default:''},
    location: {type: String, default:''},
    time: {type: String, default:''},
    note: {type: String, default:''},
    comfirm: {type: Number, default:''},
    isActive: { type: Boolean, default: true },
    createAt: { type: String, default: '' },
});

module.exports = mongoose.models.station || mongoose.model('station', station);