const express = require('express');
const router = express.Router();
const optimumController = require('../../controllers/optimum/optimumController');

router.get('/clients', optimumController.clients);
router.get('/client/:cid', optimumController.client);
router.post('/client/:cid', optimumController.editClient);

router.get('/projects', optimumController.projects);
router.get('/project/:pid', optimumController.project);
router.post('/project/:pid', optimumController.editProject);

router.get('/freeagent', optimumController.freeagent);
router.get('/freeagent_callback', optimumController.freeagentCallback)
router.get('/freeagent_users', optimumController.freeagentUsers);
router.get('/freeagent_contacts', optimumController.freeagentContacts);
router.get('/freeagent_projects', optimumController.freeagentProjects);

module.exports = router;