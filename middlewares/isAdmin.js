module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.redirect('/users/login');
};
