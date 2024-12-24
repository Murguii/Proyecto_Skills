const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    admin: { // define si el usuario es un admin o no
        type: Boolean,
        default: false // por defecto es usuario estándar
    },
    completedSkills: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Skill' // Referencia al modelo 'Skill'
    }]
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para transformar datos o aplicar lógica antes de guardar
userSchema.pre('save', function(next) {
    this.username = this.username.trim(); // Elimina espacios al inicio y al final
    next();
});

module.exports = mongoose.model('User', userSchema);