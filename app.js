const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const connectDB = require('./config/database');

const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const skillsRouter = require('./routes/skills');
const usersRouter = require('./routes/users');

require('./config/passport');

const app = express();

// Conexión a MongoDB
connectDB();

// Configuración de vista
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/skillsbd'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/skills', skillsRouter);

// Manejo de errores
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message; // Pasa el mensaje del error
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // Solo muestra el stack en modo desarrollo

  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});


module.exports = app;
