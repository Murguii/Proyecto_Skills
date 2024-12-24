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
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
