const express = require('express');
const router = express.Router();

// Redirige siempre a la página de login en la raíz
router.get('/', (req, res) => {
    res.redirect('/users/login');
});

module.exports = router;