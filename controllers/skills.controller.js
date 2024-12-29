const Skill = require('../models/skill.model');
const Evidence = require('../models/evidence.model');
const userskill = require('../models/userSkill.model');

exports.pendingCount = async (req, res) => {
    try {
      const count = await userskill.countDocuments({ completed: true, verified: false });
      res.json({ count });
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    }
  };
  
  exports.completedCount = async(req, res) => {
    try {
      const count = await userskill.countDocuments({ completed: true, verified: true });
      res.json({ count });
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    }
  };


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
    //const { skillTreeName } = req.params;

    res.render('add-skill');
};

const path = require('path');
const fs = require('fs');  // Para verificar la existencia de la carpeta y crearla si no existe

exports.addSkill = async (req, res) => {
    const { text, description, score, tasks, resources } = req.body;

    try {
        let icon = ''; // Inicializa el icono vacío

        // Verifica si se ha subido un nuevo icono
        if (req.files && req.files.icon) {
            const uploadedIcon = req.files.icon;
            const iconsFolder = path.join(__dirname, 'public', 'icons');

            // Verifica si la carpeta existe, si no, la crea
            if (!fs.existsSync(iconsFolder)) {
                fs.mkdirSync(iconsFolder);
            }

            const uploadPath = path.join(iconsFolder, uploadedIcon.name);

            // Mueve el archivo subido a la carpeta pública
            uploadedIcon.mv(uploadPath, (err) => {
                if (err) return res.status(500).send(err);
            });

            icon = `/icons/${uploadedIcon.name}`; // Guarda la ruta del nuevo icono
        } else {
            // Si no se sube un nuevo icono, usa un icono predeterminado
            icon = '/icons/default-icon.png'; // Cambia esto si tienes un icono predeterminado
        }

        // Crear un nuevo skill
        const newSkill = new Skill({
            id: Date.now(),
            text,
            description,
            icon, // Usa el icono subido
            score: parseInt(score, 10),
            tasks: tasks.split('\n').map(task => task.trim()),
            resources: resources.split('\n').map(resource => resource.trim()),
            set: "electronics", // Este es el nombre del conjunto
        });

        await newSkill.save();

        // Redirigir a la lista de competencias
        res.redirect('/index');
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

        // Verificar que la propiedad 'text' esté definida antes de acceder a ella
        if (skill && skill.text) {
            console.log("Texto de la competencia:", skill.text);
        } else {
            console.log("No se encontró 'text' en la competencia");
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
    const { text, description, score, tasks, resources } = req.body;

    try {
        let icon = ''; // Inicializa el icono vacío

        // Verifica si se ha subido un nuevo icono
        if (req.files && req.files.icon) {
            const uploadedIcon = req.files.icon;
            const uploadPath = path.join(__dirname, 'public', 'icons', uploadedIcon.name);

            // Mueve el archivo subido a la carpeta pública
            uploadedIcon.mv(uploadPath, (err) => {
                if (err) return res.status(500).send(err);
            });

            icon = `/icons/${uploadedIcon.name}`; // Guarda la ruta del nuevo icono
        } else {
            // Si no se sube un nuevo icono, mantiene el icono actual
            const existingSkill = await Skill.findOne({ id: id, set: skillTreeName });
            icon = existingSkill.icon; // Mantiene el icono actual si no se sube un nuevo archivo
        }

        // Buscar y actualizar la competencia
        const skill = await Skill.findOneAndUpdate(
            { id: id, set: skillTreeName },
            {
                text,
                description,
                icon, // Actualiza el icono si es necesario
                score: parseInt(score, 10),
                tasks: tasks.split('\n').map(task => task.trim()),
                resources: resources.split('\n').map(resource => resource.trim()),
            },
            { new: true } // Devolver el documento actualizado
        );

        if (!skill) {
            return res.status(404).send('Competencia no encontrada');
        }

        // Redirigir a la lista de competencias
        res.redirect('/index');
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
    const { skillTreeName, id } = req.params;

    try {
        // Buscar la habilidad en la base de datos en vez del ¿¿json??
        const skill = await Skill.findOne({id: id });

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.render('skillPage', { skill });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (error) {
        res.status(500).send('Error al obtener los datos de las habilidades');
    }
};