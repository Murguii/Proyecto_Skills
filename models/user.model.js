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
    admin: { //definiremos si el usuario es un usuario común o un admin
        type: Boolean,
        default: false //por defecto usuario estándar
    },
    completedSkills: {
        type: [] //falta como referenciar a las skills ¿¿(mongoose.Schema.Types.ObjectId, href = 'Skill')??
    }
});

// Middlewares
/*
estudianteSchema.pre('save', function(next) {
    this.nombre = this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1);
    next();
}); */



module.exports = mongoose.model('User', userSchema);