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
                req.session.user = username;
                res.status(201).json(savedUser);
            }
            else { //ya hay usuarios registrados por lo tanto es un usuario standard
                const user = new User({ username,  password: hashedPassword });
                const savedUser = await user.save();
                req.session.user = username;
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

        //return res.redirect('/');
        return res.status(201).json({ message: 'Login exitoso' });

        /*
        req.session.user = username;
        res.redirect('/dashboard');
        */

    } catch (error) {
        next(error);
    }
};

