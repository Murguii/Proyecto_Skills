var express = require('express');
var router = express.Router();
const usersController = require('../controllers/users.controller');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const leaderboardController = require('../controllers/leaderboard.controller');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Ruta para mostrar el formulario de registro
router.get('/register', usersController.getRegisterForm);

// Ruta para registrar un usuario
router.post('/register', usersController.registerUser);

// Ruta para mostrar el formulario de login
router.get('/login', usersController.getLoginForm);

// Ruta para hacer login
router.post('/login', usersController.loginUser);

// Ruta para renderizar index.ejs (accesible solo si el usuario está autenticado)
router.get('/index', isAuthenticated, (req, res) => {
  res.render('index', { 
      title: 'Electronics Skills', 
      isAdmin: req.session.user?.admin || false // Verifica si el usuario es administrador
  });
});

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


// Ruta para renderizar el leaderboard (protegida)
router.get('/leaderboard', isAuthenticated, leaderboardController.renderLeaderboard);

router.get('/getUser/:user', usersController.getUser);

module.exports = router;
