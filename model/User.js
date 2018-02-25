const sql = require('../services/tedious');

/*
const s = new sql.sqlServer();
let sqlQuery = "SELECT * FROM solution_user;";
s.tpQuery(sqlQuery).then((data) =>{
    res.json(data);
})
*/

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

}

module.exports = User;