const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/isAuthenticated'); // Middleware de autenticación
const { isAdmin } = require('../middlewares/isAuthenticated');
const skillsController = require('../controllers/skills.controller'); // Importa el controlador

// Editar Skill
router.get('/:skillTree/edit/:id', isAuthenticated, (req, res) => {
    const { skillTree, id } = req.params;
    // Aquí puedes buscar el Skill en la base de datos por ID
    res.render('edit-skill', { skillTree, skill: { id, name: 'Skill Name', description: 'Description', tasks: [], score: 1 } });
});

// Agregar Skill
router.get('/:skillTree/add', isAuthenticated, (req, res) => {
    const { skillTree } = req.params;
    res.render('addSkill', { skillTree });
});

// GET /skills/
router.get('/', isAuthenticated, skillsController.redirectToDefaultSkill);

// GET /skills/:skillTreeName
router.get('/:skillTreeName', isAuthenticated, skillsController.getSkillsBySet);

// GET /skills/:skillTreeName/add
router.get('/:skillTreeName/add', isAdmin, skillsController.getAddSkillForm);

// POST /skills/:skillTreeName/add
router.post('/:skillTreeName/add', isAdmin, skillsController.addSkill);

// GET /skills/:skillTreeName/view/:skillID
router.get('/:skillTreeName/view/:skillID', isAuthenticated, skillsController.viewSkillDetails);

// POST /skills/:skillTreeName/:skillID/verify
router.post('/:skillTreeName/:skillID/verify', isAdmin, skillsController.verifyEvidence);

// GET /skills/:skillTreeName/edit/:skillID
router.get('/:skillTreeName/edit/:skillID', isAdmin, skillsController.getEditSkillForm);

// POST /skills/:skillTreeName/edit/:skillID
router.post('/:skillTreeName/edit/:skillID', isAdmin, skillsController.updateSkill);

// POST /skills/:skillTreeName/submit-evidence
router.post('/:skillTreeName/submit-evidence', isAuthenticated, skillsController.submitEvidence);

// POST /skills/:skillTreeName/delete/:skillID
router.post('/:skillTreeName/delete/:skillID', isAdmin, skillsController.deleteSkill);

router.get('/skills/:skillTreeName/view/:skillID', skillsController.viewSkill); //para cargar la página de la skill concreta


module.exports = router;