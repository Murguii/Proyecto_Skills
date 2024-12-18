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
    role: { //definiremos si el usuario es un usuario común o un admin
        type: String,
        default: 'standard' //por defecto usuario estándar
    }
});

// Middlewares
/*
estudianteSchema.pre('save', function(next) {
    this.nombre = this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1);
    next();
}); */



module.exports = mongoose.model('User', userSchema);