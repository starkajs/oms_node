const sql = require('../services/tedious');
//const bcrypt = require('bcrypt');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');

class User {
    async initEmail(email) {
        const s = new sql.sqlServer();
        let sqlQuery = `SELECT * FROM solution_user WHERE email = '${email}'`;
        let user = await s.tpQuery(sqlQuery);
        this.full_name = user[0].full_name;
        this.email = email;
        this.role_id = user[0].role_id;
        this.last_login = user[0].last_login;
        this.is_active = user[0].is_active;
    }
    async createUser(email, full_name, password) {
        const saltRounds = 10;
        //let salt = bcrypt.genSaltSync(saltRounds);
        let password_hash = bcrypt.hashSync(password);
        const s = new sql.sqlServer();
        let sqlQuery = `INSERT INTO solution_user (full_name, email, password_hash, is_active, role_id)
                        OUTPUT inserted.id
                        VALUES ('${full_name}', '${email}', '${password_hash}', 1, (SELECT id FROM solution_role WHERE role_name = 'Visitor'))`
        try {
            let new_user = await s.tpQuery(sqlQuery);
            this.user_id = new_user;
            this.email = email;
            this.full_name = full_name;
            this.password_hash = password_hash;
        } catch(err) {
            this.error = err;
        }
    }
}

module.exports = User;