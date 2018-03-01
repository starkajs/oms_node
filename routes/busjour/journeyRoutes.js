const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');
const journeyController = require('../../controllers/busjour/journeyController');

router.get('/journeys', journeyController.journeys);
router.get('/journey/:jid', journeyController.journey);

module.exports = router;