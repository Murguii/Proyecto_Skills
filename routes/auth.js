const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/'
}));

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github'));

// Callback de GitHub
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: '/'
}));

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión'); // Asegura que envía una única respuesta
        }
        res.clearCookie('connect.sid'); // Limpia la cookie de sesión
        return res.redirect('/users/login'); // Redirige al login después de cerrar sesión
    });
});


module.exports = router;
