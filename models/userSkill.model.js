const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
    skill: { type: String, required: true }, // Guardará el nombre de la habilidad
    user: { type: String, required: true }, // Guardará el nombre del usuario
    selectedTasks: { type: [String], default: [] },
    completed: { type: Boolean, required: true },
    completedAt: { type: Date, default: null },
    evidence: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    verifications: [{
        user: { type: String, required: true }, // Guardará el nombre del usuario que verifica
        approved: { type: Boolean, required: true },
        verifiedAt: { type: Date, required: true },
    }],
});

module.exports = mongoose.model('UserSkill', userSkillSchema);
