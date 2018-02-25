const passport = require('passport');
const sql = require('../services/tedious');

module.exports = (app) => {
    // GOOGLE
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    })
    );
    app.get('/auth/google/callback',
        passport.authenticate('google', {failureRedirect: '/api/this_user'}), (req, res) => {
        res.redirect('/api/this_user');
    });

    // AZURE
    app.get('/auth/azure', passport.authenticate('azure_oauth2', {
        scope: ['profile']
    }));
    app.get('/auth/azure/callback',
    passport.authenticate('azure_oauth2', {failureRedirect: '/api/this_user'}), (req, res) => {
    res.redirect('/api/this_user');
});

    app.get('/auth/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    });

};

