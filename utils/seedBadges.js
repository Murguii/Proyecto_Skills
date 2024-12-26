const fs = require('fs');
const path = require('path');
const Badge = require('../models/badge.model');

const seedBadges = async () => {
    try {
        const badgesFilePath = path.join(__dirname, '..', 'public', 'medals.json');

        // Verifica si el archivo medals.json existe
        if (!fs.existsSync(badgesFilePath)) {
            console.error('El archivo medals.json no existe. Asegúrate de generar las insignias primero.');
            return;
        }

        // Lee el archivo medals.json
        const badgesData = JSON.parse(fs.readFileSync(badgesFilePath, 'utf8'));

        // Verifica si ya hay insignias en la base de datos
        const existingBadges = await Badge.find();
        if (existingBadges.length > 0) {
            console.log('Las insignias ya están cargadas en la base de datos.');
            return;
        }

        // Mapea los datos para adaptarlos al esquema Badge y los inserta
        const badges = badgesData.map(badge => ({
            name: badge.rango,
            range: badge.rango,
            bitpoints_min: badge.bitpoints_min,
            bitpoints_max: badge.bitpoints_max,
            image_url: `/badges/${badge.png}` // Ruta relativa para las imágenes
        }));

        await Badge.insertMany(badges);
        console.log('Insignias cargadas exitosamente en la base de datos.');
    } catch (error) {
        console.error('Error al cargar las insignias:', error);
    }
};

module.exports = seedBadges;
