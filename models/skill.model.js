const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    set: {
        type: String,
        required: true
    },
    tasks: {
        type: [String],
        required: true
    },
    resources: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 1,
        required: true
    },
});

// Middlewares
/*
estudianteSchema.pre('save', function(next) {
    this.nombre = this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1);
    next();
}); */



module.exports = mongoose.model('Skill', skillSchema);