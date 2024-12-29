const User = require('../models/user.model');
const medals = require('../public/medals.json');

exports.renderLeaderboard = async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 }); // Ordena usuarios por puntaje
        const leaderboard = medals.map(medal => ({
            rangeName: medal.rango,
            users: users.filter(user => user.score >= medal.bitpoints_min && user.score <= medal.bitpoints_max)
                         .map(user => ({
                             username: user.username,
                             score: user.score,
                             badge: medal.png
                         }))
        }));

        res.render('leaderboard', { user: req.user, leaderboard }); // Renderiza la vista con los datos
    } catch (error) {
        console.error('Error al cargar el leaderboard:', error);
        res.status(500).send('Error al cargar el leaderboard');
    }
};
