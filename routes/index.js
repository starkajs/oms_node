const express = require('express');
const router = express.Router();
const baseController = require('../controllers/baseController');

// Do work here
router.get('/', baseController.homePage);

module.exports = router;