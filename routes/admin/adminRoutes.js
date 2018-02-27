const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const authController = require('../../controllers/auth/authController');
const { catchErrors } = require('../../middlewares/errorHandlers');

router.get('/roles', adminController.roles);

router.get('/users', adminController.users);

router.post('/register',
    adminController.validateRegister,
    adminController.registerUser
);

router.get('/user/:id', adminController.user);
router.post('/edit_user/:id', adminController.editUser);

module.exports = router;