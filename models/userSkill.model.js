const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Skill',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    completedAt: {
        type: Date,
        default: null // Opcional: permite valores nulos inicialmente
    },
    evidence: {
        type: String,
        default: '' // Opcional: evita el error si está vacío
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    selectedTasks: {
        type: [String],
        default: []
    },
    verifications: [{
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
        },
        approved: {
            type: Boolean,
            required: true
        },
        verifiedAt: {
            type: Date,
            required: true
        }
    }]
});

module.exports = mongoose.model('UserSkill', userSkillSchema);
