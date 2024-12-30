const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const Skill = require('../models/skill.model'); // Importar modelo Skill

// Ruta para la página de bienvenida
router.get('/', (req, res) => {
    res.render('welcome');
});

// Ruta protegida para renderizar index.ejs
router.get('/index', isAuthenticated, async (req, res) => {
    try {
        const skillCount = await Skill.countDocuments({ set: 'electronics' });
        res.render('index', {
            title: 'Electronics Skills',
            isAdmin: req.session.user?.admin || false,
            user: req.session.user, // Pasa la información del usuario a la vista
            skillCount, // Pasar conteo de habilidades
        });
    } catch (error) {
        console.error('Error al contar las skills:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página "About"
router.get('/about', (req, res) => {
    res.render('about', { user: req.session.user });
});

module.exports = router;