const sql = require('../../services/tedious');
const promisify = require('es6-promisify');
const User = require('../../model/User');
const bcrypt = require('bcrypt-nodejs');

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

exports.user = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT a.*, b.role_name FROM solution_user AS a LEFT JOIN solution_role AS b on a.role_id = b.id WHERE a.id = '${req.params.id}'`
    let editUser = await s.tpQuery(sqlQuery);
    editUser = editUser[0];
    sqlQuery = `SELECT * FROM solution_role ORDER BY role_name`;
    let roles = await s.tpQuery(sqlQuery);
    res.render('admin/user', {title: 'Solution User', editUser, roles})
}

exports.editUser = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = ''
    if (req.body.password != null) {
        let password_hash = bcrypt.hashSync(req.body.password);
        sqlQuery = `UPDATE solution_user SET password_hash = '${password_hash}' WHERE id = '${req.params.id}'`
    } else {
        sqlQuery = `UPDATE solution_user SET full_name = '${req.body.full_name}',
        email = '${req.body.email}', role_id = '${req.body.role_id}',
        is_active = ${req.body.is_active} WHERE id = '${req.params.id}'`
    }
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'User updated');
            res.redirect(`/admin/user/${req.params.id}`);
            return;
        })
        .fail((err) => {
            req.flash('danger', err);
            res.redirect(`/admin/user/${req.params.id}`);
            return;
        })
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