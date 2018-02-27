const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');
const sysselController = require('../../controllers/syssel/sysselController');

// CATEGORIES
/*
router.get('/categories', async (req, res) => {
    const order = req.query.order || 'asc';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT COUNT(*) AS total_count FROM ss_category`;
    let recordCount = await s.tpQuery(sqlQuery);
    if (req.query.filter){
        const filterJSON = JSON.parse(req.query.filter);
        const filter_field = Object.keys(filterJSON)[0];
        const filter_value = filterJSON[filter_field];
        sqlQuery = `SELECT a.*, (SELECT COUNT(1) FROM ss_system_category AS aa WHERE aa.category_id = a.id) AS system_count
        FROM ss_category AS a
        WHERE LOWER(${filter_field}) like LOWER('%${filter_value}%')
        ORDER BY category_name
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY;`;
    } else {
        sqlQuery = `SELECT a.*, (SELECT COUNT(1) FROM ss_system_category AS aa WHERE aa.category_id = a.id) AS system_count
        FROM ss_category AS a
        ORDER BY category_name
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY;`;
    }

    let data = await s.tpQuery(sqlQuery);
    responseJson = {};
    responseJson['total'] = recordCount[0]['total_count'];
    responseJson['rows'] = data;
    res.json(responseJson);
});
*/

router.get('/categories', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT *, (SELECT COUNT(1) FROM ss_system_category AS aa WHERE aa.category_id = a.id) AS system_count
                    FROM ss_category AS a
                    ORDER BY category_name`
    let data = await s.tpQuery(sqlQuery);
    res.json(data)   ;
})

router.get('/category_systems/:id', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT b.id AS system_id,
                    b.system_name
                    FROM ss_system_category AS a
                    LEFT JOIN ss_system AS b ON a.system_id = b.id
                    WHERE a.category_id = '${req.params.id}'
                    ORDER BY b.system_name;`
    let systems = await s.tpQuery(sqlQuery);
    res.json(systems)
})

router.post('/add_category', sysselController.addCategory);

// FEATURES
router.get('/features', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT *, (SELECT COUNT(1) FROM ss_system_feature AS aa WHERE aa.feature_id = a.id) AS system_count
                    FROM ss_feature AS a
                    ORDER BY feature_name;`
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.get('/feature_systems/:id', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT b.id AS system_id,
                    b.system_name
                    FROM ss_system_feature AS a
                    LEFT JOIN ss_system AS b ON a.system_id = b.id
                    WHERE a.feature_id = '${req.params.id}'
                    ORDER BY b.system_name;`
    let systems = await s.tpQuery(sqlQuery);
    res.json(systems)
})

router.post('/add_feature', sysselController.addFeature);

module.exports = router;