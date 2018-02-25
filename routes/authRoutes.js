const express = require('express');
const router = express.Router();
const passport = require('passport');
const sql = require('../services/tedious');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
})
);
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/api/this_user'}), (req, res) => {
    res.redirect('/api/this_user');
});

// AZURE
router.get('/azure', passport.authenticate('azure_oauth2', {
    scope: ['profile']
}));
router.get('/azure/callback',
passport.authenticate('azure_oauth2', {failureRedirect: '/api/this_user'}), (req, res) => {
res.redirect('/api/this_user');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;