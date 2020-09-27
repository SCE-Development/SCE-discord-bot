const mongoose = require('mongoose');

const PointSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userID: String,
    points: Number,
    lastTalked: String
});

module.exports = mongoose.model('Points', PointSchema);
