const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const connectDB = require('./config/database');
const seedBadges = require('./utils/seedBadges');
const seedSkills = require('./utils/seedSkills'); // Importa la función

// Importación de routers
const adminRouter = require('./routes/admin');
const indexRouter = require('./routes/index'); // Maneja el login
const usersRouter = require('./routes/users');
const skillsRouter = require('./routes/skills');

require('./config/passport');

const app = express();

// Conexión a MongoDB
connectDB().then(() => {
    // Inicializa las insignias y habilidades al conectar a la base de datos
    seedBadges();
    //seedSkills();
});

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false, // No crea sesiones vacías
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/skillsbd'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware para manejar mensajes flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Rutas
app.use('/', indexRouter); // Siempre muestra el login
app.use('/users', usersRouter); // Rutas relacionadas con usuarios
app.use('/admin', adminRouter); // Rutas de administración
app.use('/skills', skillsRouter); // Rutas relacionadas con habilidades

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Página no encontrada',
        error: {}
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { message: err.message, error: req.app.get('env') === 'development' ? err : {} });
});

module.exports = app;
