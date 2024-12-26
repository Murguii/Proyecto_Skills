const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/isAuthenticated');
const adminController = require('../controllers/admin.controller');

console.log('isAdmin:', isAdmin);
console.log('adminController:', adminController);

// GET /admin/badges
router.get('/badges', isAdmin, adminController.getBadges);

// GET /admin/badges/edit/:id
router.get('/badges/edit/:id', isAdmin, adminController.getEditBadge);

// POST /admin/badges/edit/:id
router.post('/badges/edit/:id', isAdmin, adminController.postEditBadge);

// POST /admin/badges/delete/:id
router.post('/badges/delete/:id', isAdmin, adminController.postDeleteBadge);

// POST /admin/change-password
router.post('/change-password', isAdmin, adminController.changePassword);

router.get('/dashboard', adminController.dashboard);

router.get('/users', isAdmin, adminController.getUsers);


// GET /admin/dashboard
exports.dashboard = (req, res) => {
    res.render('admin-dashboard', { username: req.user?.username || 'Admin' });
};


module.exports = router;