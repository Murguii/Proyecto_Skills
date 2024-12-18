var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Ruta para mostrar el formulario de register
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

//Ruta para registrar un user
router.post('/register', userController.registerUser);

//Ruta para hacer login
router.post('/login', userController.loginUser);



module.exports = router;
