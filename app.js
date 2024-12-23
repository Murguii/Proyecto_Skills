var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs'); // Para leer el archivo skills.json
const connectDB = require('./config/database');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const User = require('./models/user.model');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Conexión a MongoDB
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
*/

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/skillsbd'
  })
}));

// Rutas existentes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Ruta para la página de detalles de cada habilidad
app.get('/skill/:id', (req, res, next) => {
  const skillId = parseInt(req.params.id);  // Convertir el ID de la URL a número

  // Leer el archivo skills.json
  fs.readFile(path.join(__dirname, 'public', 'skills.json'), 'utf8', (err, data) => {
    if (err) {
      return next(createError(500, 'Error al cargar el archivo skills.json'));
    }

    const skills = JSON.parse(data);  // Parsear los datos del JSON
    const skill = skills.find(s => parseInt(s.id) === skillId);  // Convertir los IDs del JSON a número

    if (skill) {
      res.render('skillPage', { skill }); // Renderizar la página con el skill encontrado
    } else {
      return next(createError(404, 'Skill no encontrado'));  // Error si no se encuentra la habilidad
    }
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;