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

router.get('/prime', optimumController.prime);

module.exports = router;