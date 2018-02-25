const sql = require('../services/tedious');

module.exports = (app) => {
    app.get('/admin/users', (req, res) => {
        const s = new sql.sqlServer();
        let sqlQuery = "SELECT * FROM solution_user;";
        console.log(sqlQuery);
        s.tpQuery(sqlQuery).then((data) =>{
            res.json(data);
        })
    });
};