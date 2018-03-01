const express = require('express');
const router = express.Router();
const entarchController = require('../../controllers/entarch/entarchController');

router.get('/capabilities', entarchController.capabilities);
router.get('/capability/:cid', entarchController.capability);
router.post('/edit_capability/:cid', entarchController.editCapability);
router.post('/add_process/:cid', entarchController.addProcess);
router.get('/process/:pid', entarchController.eaProcess);
router.post('/edit_process/:pid', entarchController.editProcess);

module.exports = router;