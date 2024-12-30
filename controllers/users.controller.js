const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser){
            res.status(400).json({ message: 'Ya existe un usuario con ese nombre de usuario' });
        }
        else {
            const users = await User.find();
            const hashedPassword = await bcrypt.hash(password, 10);
            if (users.length === 0){ //no hay usuarios registrados por lo tanto es un admin
                //const role = true;
                const user = new User({ username,  password: hashedPassword, admin: true });
                const savedUser = await user.save();
                res.status(201).json(savedUser);
            }
            else { //ya hay usuarios registrados por lo tanto es un usuario standard
                const user = new User({ username,  password: hashedPassword });
                const savedUser = await user.save();
                res.status(201).json(savedUser);
            }
        }
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Guardar usuario en la sesión
        req.session.user = user;

        // Redirigir a /index después del login
        return res.status(200).json({ redirect: '/index' });
    } catch (error) {
        next(error);
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('username score admin completedSkills') // Selecciona solo los campos necesarios
            .populate('completedSkills', 'text'); // Opcional: Si quieres mostrar el nombre de las habilidades completadas

        // Prepara los datos para la vista
        const userList = users.map(user => ({
            username: user.username,
            score: user.score,
            admin: user.admin,
            completedSkillsCount: user.completedSkills ? user.completedSkills.length : 0
        }));

        res.render('admin-users', { users: userList });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la lista de usuarios');
    }
};

exports.getRegisterForm = (req, res) => {
    res.render('register');
};

exports.getLoginForm = (req, res) => {
    res.render('login'); // Renderiza la vista `login.ejs`
};

exports.getUser = async (req, res) => {
    const {user} = req.params;
    try {
        const users = await User.findOne({ _id: user})
            .select('username') // Selecciona solo los campos necesarios
            //.populate('completedSkills', 'text'); // Opcional: Si quieres mostrar el nombre de las habilidades completadas

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la lista de usuarios');
    }
};


