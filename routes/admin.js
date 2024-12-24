const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/isAuthenticated');
const adminController = require('../controllers/admin.controller');

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

// GET /admin/dashboard
router.get('/dashboard', adminController.dashboard);

module.exports = router;
