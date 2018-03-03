const express = require('express');
const router = express.Router();
const optimumController = require('../../controllers/optimum/optimumController');
const freeagentController = require('../../controllers/optimum/freeagentController');

router.get('/clients', optimumController.clients);
router.get('/client/:cid', optimumController.client);
router.post('/client/:cid', optimumController.editClient);

router.get('/projects', optimumController.projects);
router.get('/project/:pid', optimumController.project);
router.post('/project/:pid', optimumController.editProject);

router.get('/freeagent', freeagentController.freeagent);
router.get('/freeagent_callback', freeagentController.freeagentCallback)
router.get('/freeagent_users', freeagentController.freeagentUsers);
router.get('/freeagent_contacts', freeagentController.freeagentContacts);
router.get('/freeagent_projects', freeagentController.freeagentProjects);
router.get('/freeagent_tasks', freeagentController.freeagentTasks);
router.get('/freeagent_expenses', freeagentController.freeagentExpenses);

module.exports = router;