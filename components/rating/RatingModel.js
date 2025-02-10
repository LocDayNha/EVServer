const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const rating = new Schema({
    id: { type: ObjectId },
    user_id: { type: ObjectId, ref: "user" },
    station_id: { type: ObjectId, ref: "station" },
    title: {type: String, default:''},
    content: {type: String, default:''},
    image: {type: String, default:''},
    star: {type: Number, default:''},
    isActive: { type: Boolean, default: true },
    createAt: { type: String, default: '' },
});

module.exports = mongoose.models.rating || mongoose.model('rating', rating);