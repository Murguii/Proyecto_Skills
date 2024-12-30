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
        required: true
    },
    evidence: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    allEvidencesApproved: { // Nuevo campo
        type: Boolean,
        default: false
    },
    anyEvidenceRejected: {
        type: Boolean,
        default: false
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