const fs = require('fs');
const path = require('path');
const Skill = require('../models/skill.model');

const seedSkills = async () => {
    try {
        const skillsFilePath = path.join(__dirname, '..', 'public', 'skills.json');

        // Verifica si el archivo skills.json existe
        if (!fs.existsSync(skillsFilePath)) {
            console.error('El archivo skills.json no existe. Asegúrate de generarlo primero.');
            return;
        }

        // Lee el archivo skills.json
        const skillsData = JSON.parse(fs.readFileSync(skillsFilePath, 'utf8'));

        // Purga la colección de habilidades
        //await Skill.deleteMany({});
        //console.log('Colección de habilidades purgada.');

        // Inserta las habilidades en la base de datos
        await Skill.insertMany(skillsData);
        console.log('Habilidades recargadas exitosamente en la base de datos.');
    } catch (error) {
        console.error('Error al cargar las habilidades:', error);
    }
};

module.exports = seedSkills;