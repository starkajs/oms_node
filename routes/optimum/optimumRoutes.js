const express = require('express');
const router = express.Router();
const optimumController = require('../../controllers/optimum/optimumController');

router.get('/clients', optimumController.clients);
router.get('/client/:cid', optimumController.client);
router.post('/client/:cid', optimumController.editClient);

module.exports = router;