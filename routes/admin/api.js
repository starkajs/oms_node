const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');

router.get('/roles', (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM solution_role;`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            res.json(data);
        })
});

router.post('/update_solution_role', async (req, res) => {
    let sqlQuery = `UPDATE solution_role SET ${req.body.update_field} = '${req.body.update_value}' WHERE id = '${req.body.role_id}'`
    const s = new sql.sqlServer();
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({message: "Update complete"});
        }).fail((err) => {
            res.json({error: true, message: err['message']});
        })
})

module.exports = router;