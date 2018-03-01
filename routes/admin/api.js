const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');
const adminController = require('../../controllers/admin/adminController');

router.get('/roles', (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM solution_role ORDER BY role_name;`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            res.json(data);
        })
});

router.post('/add_solution_role', adminController.addRole);

router.post('/update_solution_role', async (req, res) => {
    let sqlQuery = `UPDATE solution_role SET ${req.body.update_field} = '${req.body.update_value}' WHERE id = '${req.body.role_id}'`
    const s = new sql.sqlServer();
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({message: "Update complete"});
        }).fail((err) => {
            res.json({error: true, message: err['message']});
        })
});

router.get('/users', (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT a.*, b.role_name FROM solution_user AS a
                    LEFT JOIN solution_role AS b on a.role_id = b.id
                    ORDER BY full_name`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            res.json(data);
        })
});

router.post('/add_solution_user', adminController.addUser);

router.get('/industries', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM trbc ORDER BY id`;
    let industries = await s.tpQuery(sqlQuery);
    res.json(industries);
})

module.exports = router;