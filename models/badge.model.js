// models/badge.model.js
const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    range: { type: String, required: true },
    bitpoints_min: { type: Number, required: true },
    bitpoints_max: { type: Number },
    image_url: { type: String, required: true },
});

module.exports = mongoose.model('Badge', badgeSchema);
