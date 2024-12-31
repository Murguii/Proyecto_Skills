// Middleware para verificar si el usuario está autenticado
module.exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user; // Asigna el usuario autenticado a req.user
        return next(); // Si el usuario está autenticado, permite el acceso
    }
    res.redirect('/users/login'); // Si no está autenticado, redirige al login
};

// Middleware para verificar si el usuario es administrador
module.exports.isAdmin = (req, res, next) => {
    if (!req.session.user) {
        // Si el usuario no está autenticado, redirigir a login
        return res.redirect('/users/login');
    }

    if (!req.session.user.admin) {
        // Si no es admin, enviar un error o redirigir a otra página
        return res.status(403).send('Acceso denegado. No tienes permisos de administrador.');
    }

    // Si es administrador, permitir el acceso
    next();
};
