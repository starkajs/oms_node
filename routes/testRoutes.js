const express = require('express');
const router = express.Router();
const sql = require('../services/tedious');

// Do work here
router.get('/tedious', (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = "SELECT * FROM solution_user;";
    s.tpQuery(sqlQuery).then((data) =>{
        res.json(data);
    })
});

module.exports = router;
