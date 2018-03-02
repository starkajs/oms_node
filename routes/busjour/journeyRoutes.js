const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');
const journeyController = require('../../controllers/busjour/journeyController');
const path = require('path');

router.get('/journeys', journeyController.journeys);
router.get('/journey/:jid', journeyController.journey);

router.get('/journey_vendors/:jid', journeyController.vendors);
router.get('/journey_vendors_score/:jid', journeyController.journeyVendorsScore);

router.get('/journey_requirements/:jid', journeyController.requirements);
router.get('/requirements_responses/:jid', journeyController.requirementsResponses);

module.exports = router;