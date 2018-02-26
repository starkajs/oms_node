const sql = require('../../services/tedious');
const promisify = require('es6-promisify');
const User = require('../../model/User');

exports.roles = (req, res) => {
    req.flash('success', ``)
    res.render('admin/roles', {
        title: 'Solution Roles'
    });
}

exports.addRole = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO solution_role (role_name)
                    OUTPUT inserted.id
                    VALUES ('${req.body.role_name}')`
    let message = await s.tpQuery(sqlQuery);
    req.flash('success', `Successfully added`);
    res.redirect('/admin/roles')
}

exports.users = (req, res) => {
    res.render('admin/users', {
        title: 'Solution Users'
    });
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('full_name');
    req.checkBody('full_name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'That email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.checkBody('confirm_password', 'Password cannot be blank').notEmpty();
    req.checkBody('confirm_password', 'The passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('danger', errors.map(err => err.msg));
        res.render('auth/login', {title: 'Register and Login', body: req.body, flashes: req.flash()});
        return;
    }
    next();
};

exports.registerUser = async (req, res, next) => {
    const user = new User;
    await user.createUser(email = req.body.email, full_name = req.body.full_name, password = req.body.password);
    if (user.error) {
        console.log("user.error: ", user.error);
        req.flash('danger', user.error);
        res.render('auth/login', {title: 'Register and Login', body: req.body, flashes: req.flash()});
        return;
    } else {
        req.flash('success', 'User registered');
        res.render('auth/login', {title: 'Register and Login', flashes: req.flash()});
        return ;
    }
    next();
};