const Badge = require('../models/badge.model');
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt");
const User = require('../models/user.model');

exports.getEditBadge = async (req, res) => {
    try {
        const nameV = req.params.name;
        const badge = await Badge.findOne({name:nameV});

        if (!badge) {
            return res.status(404).send('Insignia no encontrada');
        }

        res.render('edit-badges', { badge });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la insignia');
    }
};

exports.postEditBadge = async (req, res) => {
    try {
        const nameV = req.params.name;
        const badge2 = await Badge.findOne({name:nameV});
        const { name, range, bitpoints_min, bitpoints_max, image_url } = req.body;

        const badge = await Badge.findOneAndUpdate(
            badge2,
            {
                name,
                range,
                bitpoints_min,
                bitpoints_max,
                image_url,
            },
            { new: true }
        );

        if (!badge) {
            return res.status(404).send('Insignia no encontrada');
        }

        res.redirect('/admin/badges');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la insignia');
    }
};

exports.postDeleteBadge = async (req, res) => {
    try {
        const nameV = req.params.name;
        const badge2 = await Badge.findOne({name:nameV});

        const result = await Badge.findOneAndDelete(badge2);

        if (!result) {
            return res.status(404).send('Insignia no encontrada');
        }

        res.redirect('/admin/badges');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la insignia');
    }
};

exports.changePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ message: 'Se requieren userId y newPassword' });
    }

    try {
        // Hashea la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualiza el usuario
        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
};

exports.getBadges = async(req, res) => {
    try {
        const badges= await Badge.find(); 
        res.render('admin-badges', { badges });
    } catch (error) {
        console.error('Error al cargar las insignias:', error);
        res.status(500).send('Error al cargar las insignias.');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Consulta todos los usuarios
        res.render('admin-users', { users }); // Renderiza admin-users.ejs
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al cargar los usuarios');
    }
};


exports.dashboard = (req, res) => {
    res.render('admin-dashboard', { username: req.user?.username || 'Admin' });
};