const passport = require('passport');
const sql = require('../../services/tedious');

exports.loginRegisterForm = (req, res) => {
    res.render('auth/login', {title: 'Register or Login'})
}

exports.login = passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: ('danger', 'Failed Login!'),
    successRedirect: '/',
    successFlash: 'You are now logged in!'
  });

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('warning', 'You must be logged in');
    res.redirect('/auth/login');
}

