const Badge = require('../models/badge.model');
const fs = require('fs');
const path = require('path');

const seedBadges = async () => {
    try {
        const badgesFilePath = path.join(__dirname, '..', 'public', 'medals.json');
        if (!fs.existsSync(badgesFilePath)) {
            console.error('El archivo medals.json no existe.');
            return;
        }

        const badgesData = JSON.parse(fs.readFileSync(badgesFilePath, 'utf8'));

        // Elimina las insignias existentes antes de insertar
        await Badge.deleteMany({});
        // console.log('Colección de insignias purgada.');

        await Badge.insertMany(badgesData.map(badge => ({
            name: badge.rango,
            range: badge.rango,
            bitpoints_min: badge.bitpoints_min,
            bitpoints_max: badge.bitpoints_max,
            image_url: `/badges/${badge.png}`
        })));

        // console.log('Insignias cargadas exitosamente.');
    } catch (error) {
        console.error('Error al cargar las insignias:', error);
    }
};

module.exports = seedBadges;
