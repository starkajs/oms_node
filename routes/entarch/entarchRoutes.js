const express = require('express');
const router = express.Router();
const entarchController = require('../../controllers/entarch/entarchController');

router.get('/capabilities', entarchController.capabilities);
router.get('/capability/:cid', entarchController.capability);
router.post('/edit_capability/:cid', entarchController.editCapability);
router.post('/add_process/:cid', entarchController.addProcess);

router.get('/process/:pid', entarchController.eaProcess);
router.post('/edit_process/:pid', entarchController.editProcess);

router.get('/metrics', entarchController.metrics);
router.get('/metric/:mid', entarchController.metric);
router.post('/metric/:mid', entarchController.editMetric);

module.exports = router;