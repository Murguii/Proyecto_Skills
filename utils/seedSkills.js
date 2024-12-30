const Skill = require('../models/skill.model');
const fs = require('fs');
const path = require('path');

const seedSkills = async () => {
    try {
        const skillsFilePath = path.join(__dirname, '..', 'public', 'skills.json');
        if (!fs.existsSync(skillsFilePath)) {
            console.error('El archivo skills.json no existe.');
            return;
        }

        const skillsData = JSON.parse(fs.readFileSync(skillsFilePath, 'utf8'));

        // Elimina las habilidades existentes antes de insertar
        await Skill.deleteMany({});
        // console.log('Colección de habilidades purgada.');

        await Skill.insertMany(skillsData);
        // console.log('Habilidades cargadas exitosamente.');
    } catch (error) {
        console.error('Error al cargar las habilidades:', error);
    }
};

module.exports = seedSkills;
