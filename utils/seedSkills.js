const fs = require('fs');
const path = require('path');
const Skill = require('../models/skill.model');

const seedSkills = async () => {
    try {
        const skillsFilePath = path.join(__dirname, '..', 'public', 'skills.json');

        // Verifica si el archivo skills.json existe
        if (!fs.existsSync(skillsFilePath)) {
            console.error('El archivo skills.json no existe. Asegúrate de generar las habilidades primero.');
            return;
        }

        // Lee el archivo skills.json
        const skillsData = JSON.parse(fs.readFileSync(skillsFilePath, 'utf8'));

        // Verifica si ya hay habilidades en la base de datos
        const existingSkills = await Skill.find();
        if (existingSkills.length > 0) {
            console.log('Las habilidades ya están cargadas en la base de datos.');
            return;
        }

        // Inserta las habilidades en la base de datos
        await Skill.insertMany(skillsData);
        console.log('Habilidades cargadas exitosamente en la base de datos.');
    } catch (error) {
        console.error('Error al cargar las habilidades:', error);
    }
};

module.exports = seedSkills;
