const Skill = require('../models/skill.model');
const Evidence = require('../models/evidence.model');

exports.redirectToDefaultSkill = (req, res) => {
    try {
        // Renderiza directamente la vista index.ejs
        res.render('index', { user: req.user }); // Pasa información del usuario si es necesario
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página de inicio');
    }
};

exports.getSkillsBySet = async (req, res) => {
    const { skillTreeName } = req.params; // "set" en el modelo corresponde a "skillTreeName" en la ruta.

    try {
        const skills = await Skill.find({ set: skillTreeName }).sort({ score: -1 }); // Ordenar por puntaje

        if (!skills || skills.length === 0) {
            return res.status(404).send('No se encontraron competencias en este conjunto');
        }

        res.redirect(`/index`);
        /*res.render('skills-list', { skillTreeName, skills });*/
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las competencias');
    }
};

exports.getAddSkillForm = (req, res) => {
    const { skillTreeName } = req.params;

    res.render('add-skill', { skillTreeName });
};

exports.addSkill = async (req, res) => {
    const { skillTreeName } = req.params;
    const { text, description, icon, score, tasks, resources } = req.body;

    try {
        // Crear un nuevo skill
        const newSkill = new Skill({
            id: Date.now(), // Generar un ID único basado en la marca de tiempo
            text,
            description,
            icon,
            score: parseInt(score, 10), // Convertir puntuación a número
            tasks: tasks.split('\n').map(task => task.trim()), // Dividir tareas por línea
            resources: resources.split('\n').map(resource => resource.trim()), // Dividir recursos por línea
            set: skillTreeName, // Asociar al conjunto (árbol)
        });

        await newSkill.save();

        // Redirigir a la lista de competencias del árbol
        res.redirect(`/skills/${skillTreeName}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir la competencia');
    }
};

exports.viewSkillDetails = async (req, res) => {
    const { skillTreeName, skillID } = req.params;

    try {
        // Obtener la competencia
        const skill = await Skill.findOne({ id: skillID, set: skillTreeName });

        if (!skill) {
            return res.status(404).send('Competencia no encontrada');
        }

        // Obtener las evidencias asociadas
        const evidences = await Evidence.find({ skill: skillID }).populate('user', 'username');

        res.render('view-skill', { skillTreeName, skill, evidences });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los detalles de la competencia');
    }
};

exports.verifyEvidence = async (req, res) => {
    const { skillTreeName, skillID } = req.params;
    const { userSkillId, approved } = req.body;

    try {
        // Verificar si la evidencia existe
        const evidence = await Evidence.findById(userSkillId);

        if (!evidence) {
            return res.status(404).json({ message: 'Evidencia no encontrada' });
        }

        // Actualizar el estado de la evidencia
        evidence.status = approved === 'true' ? 'approved' : 'rejected';
        await evidence.save();

        res.json({ message: `Evidencia ${evidence.status} con éxito` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar la evidencia' });
    }
};

exports.getEditSkillForm = async (req, res) => {
    const { skillTreeName, id } = req.params;
    console.log('SkillTreeName:', skillTreeName);
    console.log('Skill ID:', id);

    try {
        // Obtener la competencia
        const skill = await Skill.findOne({ id: id, set: skillTreeName });

        if (!skill) {
            return res.status(404).send('Competencia no encontrada');
        }
        res.render('edit-skill', { skillTreeName:skillTreeName, skill:skill });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos de la competencia');
    }
};

exports.updateSkill = async (req, res) => {
    const { skillTreeName, id } = req.params;
    const { text, description, icon, score, tasks, resources } = req.body;

    try {
        // Buscar y actualizar la competencia
        const skill = await Skill.findOneAndUpdate(
            { id: id, set: skillTreeName },
            {
                text,
                description,
                icon,
                score: parseInt(score, 10),
                tasks: tasks.split('\n').map(task => task.trim()), // Dividir tareas por línea
                resources: resources.split('\n').map(resource => resource.trim()), // Dividir recursos por línea
            },
            { new: true } // Devolver el documento actualizado
        );

        if (!skill) {
            return res.status(404).send('Competencia no encontrada');
        }

        // Redirigir a la lista de competencias
        //res.redirect(`/skills/${skillTreeName}`);
        res.redirect('/index');
        //res.render('skills-list', { skillTreeName:skillTreeName, skills:skill });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la competencia');
    }
};

exports.submitEvidence = async (req, res) => {
    const { skillTreeName } = req.params;
    const { skillId, evidence, userSkillId } = req.body;

    try {
        // Validar los datos enviados
        if (!skillId || !evidence) {
            return res.status(400).json({ message: 'Skill ID y evidencia son obligatorios' });
        }

        // Crear nueva evidencia
        const newEvidence = new Evidence({
            user: req.user._id, // ID del usuario autenticado
            skill: skillId,
            evidence,
            status: 'pending', // Estado inicial pendiente
        });

        await newEvidence.save();

        res.json({ message: 'Evidencia enviada correctamente', evidence: newEvidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar la evidencia' });
    }
};

exports.deleteSkill = async (req, res) => {
    const { skillTreeName, skillID } = req.params;

    try {
        // Buscar y eliminar la competencia
        const skill = await Skill.findOneAndDelete({ id: skillID, set: skillTreeName });

        if (!skill) {
            return res.status(404).send('Competencia no encontrada');
        }

        // Redirigir a la lista de competencias
        res.redirect(`/skills/${skillTreeName}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la competencia');
    }
};

exports.getSkills = (req, res) => {
    res.render('skills', { user: req.user }); // Renderiza las habilidades disponibles
};

//para cargar la página de la skill concreta
exports.viewSkill = async (req, res) => {
    const { skillTreeName, skillID } = req.params;

    try {
        // Buscar la habilidad en la base de datos en vez del ¿¿json??
        const skill = await Skill.findOne({ set: skillTreeName, id: skillID });

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.render('skillPage', { skill });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};