const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/isAuthenticated');

// Ruta para la página de bienvenida
router.get('/', (req, res) => {
    res.render('welcome');
  });

// Ruta protegida para renderizar index.ejs
router.get('/index', isAuthenticated, (req, res) => {
    res.render('index', {
        title: 'Electronics Skills',
        isAdmin: req.session.user?.admin || false,
        user: req.session.user // Pasa la información del usuario a la vista
    });
});

router.get('/about', (req, res) => {
    res.render('about', { user: req.session.user });
});

module.exports = router;

