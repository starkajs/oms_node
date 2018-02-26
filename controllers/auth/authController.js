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



