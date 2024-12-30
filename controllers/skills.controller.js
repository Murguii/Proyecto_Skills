const Skill = require('../models/skill.model');
const Evidence = require('../models/evidence.model');
const userskill = require('../models/userSkill.model');
const User = require('../models/user.model');

exports.pendingCount = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findOne({ id: id });
        if (!skill) {
            return res.status(404).json({ message: 'Skill no encontrada' });
        }
      const count = await userskill.countDocuments({ skill: skill._id, completed: true, verified: false });
      res.json({ count });
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    }
  };
  
  exports.completedCount = async(req, res) => {
      const { id } = req.params;
    try {
        const skill = await Skill.findOne({ id: id });
        if (!skill) {
            return res.status(404).json({ message: 'Skill no encontrada' });
        }
        const count = await userskill.countDocuments({ skill: skill._id, completed: true, verified: true });
      res.json({ count });
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    }
  };


exports.redirectToDefaultSkill = async (req, res) => {
    try {
        const skillCount = await Skill.countDocuments({ set: 'electronics' });
        res.render('index', { user: req.user, skillCount, isAdmin: req.user?.admin });
    } catch (error) {
        console.error('Error al contar las skills:', error);
        res.status(500).send('Error interno del servidor');
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
        //res.render('skills-list', { skillTreeName, skills });
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
        // Verifica que la habilidad exista antes de eliminar
        const skill = await Skill.findOne({ id: skillID, set: skillTreeName });

        if (!skill) {
            return res.status(404).send('Competencia no encontrada');
        }

        // Elimina la habilidad
        await Skill.findOneAndDelete({ id: skillID, set: skillTreeName });

        // Verifica si la habilidad fue eliminada
        const checkSkill = await Skill.findOne({ id: skillID, set: skillTreeName });
        if (checkSkill) {
            throw new Error(`La habilidad con ID ${skillID} no pudo ser eliminada.`);
        }

        console.log(`Habilidad con ID ${skillID} eliminada correctamente del árbol ${skillTreeName}`);
        //res.redirect(`/skills/${skillTreeName}`);
        res.redirect('/index');
    } catch (error) {
        console.error('Error al eliminar la competencia:', error);
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

exports.createEvidence = async (req, res) => {
    const { skillId } = req.params;
    const { evidence } = req.body;

    try {
        // Validar los datos enviados
        if (!skillId || !evidence) {
            return res.status(400).json({ message: 'Skill ID y evidencia son obligatorios' });
        }

        const username = req.session.user.username;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        //const id = parseInt(skillId);
        const skill = await Skill.findOne({ id: skillId });
        if (!skill) {
            return res.status(404).json({ message: 'Habilidad no encontrada' });
        }
        // Crear nueva evidencia

        const newEvidence = new userskill({
            user: user._id, // ID del usuario autenticado
            skill: skill._id,
            completed: true,
            completedAt: new Date(),
            evidence: evidence,
            verified: false,
            verifications: [] // Estado inicial pendiente
        });
        console.log('Antes del save');
        await newEvidence.save();

        res.json({ message: 'Evidencia enviada correctamente', evidence: newEvidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar la evidencia' });
    }
};

exports.approveEvidence = async (req, res) => {
    const { skillId, user } = req.params;
    const { evidence } = req.body;
    console.log(user);
    try {
        // Validar los datos enviados
        if (!skillId) {
            return res.status(400).json({ message: 'Skill ID y evidencia son obligatorios' });
        }

        const username = req.session.user.username;
        const userApproves = await User.findOne({ username: username });
        const userEvidence = await User.findOne({ username: user });
        if (!userApproves || !userEvidence) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        //const id = parseInt(skillId);
        const skill = await Skill.findOne({ id: skillId });
        if (!skill) {
            return res.status(404).json({ message: 'Habilidad no encontrada' });
        }
        // Crear nueva evidencia
        console.log('User id: ', userEvidence._id);
        const existingEvidence = await userskill.findOne({ skill: skill._id, user: userEvidence._id });
        if (!existingEvidence) {
            return res.status(404).json({ message: 'No se encontró la evidencia para la actualización' });
        }

        const newEvidence = await userskill.findOneAndUpdate(
            { skill: skill._id, user: userEvidence._id, evidence: evidence },
            {
                $set: {verified: true},
                $push: {
                    verifications: {
                        user: userApproves._id,
                        approved: true,
                        verifiedAt: new Date()
                    }
                }
            },
            { new: true }                          // Devuelve el documento actualizado
        );

        //const updatedEvidence = await userskill.findOne({ skill: skill._id, user: user._id });


        res.json({ message: 'Evidencia actualizada correctamente', evidence: newEvidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar la evidencia' });
    }
};

exports.rejectEvidence = async (req, res) => {
    const { skillId } = req.params;
    const { evidence } = req.body;

    try {
        // Validar los datos enviados
        if (!skillId) {
            return res.status(400).json({ message: 'Skill ID y evidencia son obligatorios' });
        }

        const username = req.session.user.username;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        //const id = parseInt(skillId);
        const skill = await Skill.findOne({ id: skillId });
        if (!skill) {
            return res.status(404).json({ message: 'Habilidad no encontrada' });
        }
        // Crear nueva evidencia
        const existingEvidence = await userskill.findOne({ skill: skill._id, user: user._id });
        if (!existingEvidence) {
            return res.status(404).json({ message: 'No se encontró la evidencia para la actualización' });
        }

        const deletedEvidence = await userskill.deleteOne({ skill: skill._id, user: user._id, evidence: evidence });

        //const updatedEvidence = await userskill.findOne({ skill: skill._id, user: user._id });


        res.json({ message: 'Evidencia actualizada correctamente', evidence: deletedEvidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar la evidencia' });
    }
};


exports.verifyHexagons = async (req, res) => {
    try {
        let verifiedSkills = [];

        // Recoger los IDs de las skills que tienen evidencias
        const skillsId = await userskill.distinct('skill');
        if (!skillsId || skillsId.length === 0) {
            return res.status(404).json({ message: 'No se encontraron habilidades con evidencias' });
        }

        for (const id of skillsId) {
            // console.log("Verificando ID de skill:", id);

            const evidences = await userskill.find({ skill: id }); // Recoger las evidencias de cada skill
            if (!evidences || evidences.length === 0) {
                console.warn(`No se encontraron evidencias para el ID de skill: ${id}`);
                continue; // Pasar al siguiente ID
            }

            let cont = evidences.length; // Total de evidencias a verificar

            for (const evidence of evidences) {
                if (evidence.verifications.length >= 3) {
                    cont--;
                } else {
                    // Verificar si algún aprobador es admin
                    const userIds = evidence.verifications.map((verification) => verification.user);
                    for (const user of userIds) {
                        const userBD = await User.findOne({ _id: user });
                        if (userBD?.admin) { // Si es admin, se considera aprobada
                            cont--;
                            break;
                        }
                    }
                }
            }

            if (cont === 0) {
                const skill = await Skill.findOne({ _id: id });
                if (!skill) {
                    // console.warn(`Skill no encontrada para el ID: ${id}`);
                    continue; // Pasar al siguiente ID
                }
                verifiedSkills.push(skill.id);
            }
        }

        res.json(verifiedSkills);
    } catch (error) {
        console.error("Error en verifyHexagons:", error);
        res.status(500).json({ message: 'Error al procesar las evidencias' });
    }
};


/*
// cambiado
exports.approveEvidence = async (req, res) => {
    const { skillId, evidenceId } = req.params;

    try {
        const evidence = await userskill.findById(evidenceId);
        if (!evidence) {
            return res.status(404).json({ message: 'Evidencia no encontrada' });
        }

        evidence.verified = true;
        evidence.rejected = false;
        await evidence.save();

        // Verificar si hay alguna evidencia rechazada y contar las aprobadas
        const allEvidences = await userskill.find({ skill: skillId, user: evidence.user });
        const anyRejected = allEvidences.some(evidence => evidence.rejected);
        const approvedCount = allEvidences.filter(evidence => evidence.verified).length;

        await userskill.updateMany(
            { skill: skillId, user: evidence.user },
            { $set: { anyEvidenceRejected: anyRejected, approvedEvidenceCount: approvedCount } }
        );

        res.json({ message: 'Evidencia aprobada correctamente', evidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al aprobar la evidencia' });
    }
};
exports.rejectEvidence = async (req, res) => {
    const { skillId, evidenceId } = req.params;

    try {
        const evidence = await userskill.findById(evidenceId);
        if (!evidence) {
            return res.status(404).json({ message: 'Evidencia no encontrada' });
        }

        evidence.verified = false;
        evidence.rejected = true;
        await evidence.save();

        // Verificar si hay alguna evidencia rechazada y contar las aprobadas
        const allEvidences = await userskill.find({ skill: skillId, user: evidence.user });
        const anyRejected = allEvidences.some(evidence => evidence.rejected);
        const approvedCount = allEvidences.filter(evidence => evidence.verified).length;

        await userskill.updateMany(
            { skill: skillId, user: evidence.user },
            { $set: { anyEvidenceRejected: anyRejected, approvedEvidenceCount: approvedCount } }
        );

        res.json({ message: 'Evidencia rechazada correctamente', evidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al rechazar la evidencia' });
    }
};
*/

exports.getEvidences = async (req, res) => {
    const { skillId } = req.params;

    try {
        /*
        const username = req.session.user.username;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        */

        const skill = await Skill.findOne({ id: skillId });
        if (!skill) {
            return res.status(404).json({ message: 'Habilidad no encontrada' });
        }
        // Crear nueva evidencia
        const evidences = await userskill.find({ skill: skill._id, verified: false });
        res.json(evidences);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar la evidencia' });
    }
};