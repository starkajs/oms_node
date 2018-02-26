const express = require('express');
const router = express.Router();
const passport = require('passport');
const sql = require('../../services/tedious');
const authController = require('../../controllers/auth/authController');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
})
);
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/');
});

// AZURE
router.get('/azure', passport.authenticate('azure_oauth2', {
    scope: ['profile']
}));
router.get('/azure/callback',
passport.authenticate('azure_oauth2', {failureRedirect: '/'}), (req, res) => {
res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/login', authController.loginRegisterForm);
router.post('/login', authController.login);

module.exports = router;