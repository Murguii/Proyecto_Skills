const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: Number, required: true }, // Referencia al ID de la competencia
    evidence: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

module.exports = mongoose.model('Evidence', evidenceSchema);
