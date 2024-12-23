var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Skills', isAdmin: req.session.user.admin }); //añadir si req.user es admin para mostrar/ocultar el icono del lapiz
});

module.exports = router;
