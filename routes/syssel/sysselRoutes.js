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
router.get('/modules', sysselController.modules);
router.get('/module/:id', sysselController.module);
router.post('/module/:id', sysselController.editModule);
router.get('/delete_module/:id', sysselController.deleteModule);
router.get('/submodule/:id', sysselController.subModule);
router.post('/submodule/:id', sysselController.editSubModule);

// SYSTEMS
router.get('/systems', sysselController.systems);
router.get('/delete_system/:id', sysselController.deleteSystem);
router.get('/system/:id', sysselController.system);
router.post('/system/:id', sysselController.editSystem);


// VENDORS
router.get('/vendors', sysselController.vendors);
router.get('/delete_vendor/:id', sysselController.deleteVendor);
router.get('/vendor/:id', sysselController.viewVendor);
router.post('/vendor/:id', sysselController.editVendor);




module.exports = router;