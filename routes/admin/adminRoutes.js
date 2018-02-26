const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const { catchErrors } = require('../../middlewares/errorHandlers');

router.get('/roles', catchErrors(adminController.roles));

router.get('/users', catchErrors(adminController.users));

router.post('/register',
    adminController.validateRegister,
    adminController.registerUser
);

module.exports = router;