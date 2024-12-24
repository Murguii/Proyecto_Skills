var express = require('express');
var router = express.Router();
const usersController = require('../controllers/users.controller');


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
router.post('/register', usersController.registerUser);

//Ruta para hacer login
router.post('/login', usersController.loginUser);

// GET /users/register
router.get('/register', usersController.getRegisterForm);

// POST /users/register
router.post('/register', usersController.registerUser);

// GET /users/login
router.get('/login', usersController.getLoginForm);



module.exports = router;
