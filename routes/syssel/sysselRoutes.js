const express = require('express');
const router = express.Router();
const sysselController = require('../../controllers/syssel/sysselController');

// CATEGORIES
router.get('/categories', sysselController.categories);
router.get('/category/:id', sysselController.category);
router.post('/category/:id', sysselController.editCategory);
router.get('/delete_category/:id', sysselController.deleteCategory);

// FEATURES
router.get('/features', sysselController.features);
router.get('/feature/:id', sysselController.feature);
router.post('/feature/:id', sysselController.editFeature);
router.get('/delete_feature/:id', sysselController.deleteFeature);


// MODULES



// VENDORS



// SYSTEMS

module.exports = router;