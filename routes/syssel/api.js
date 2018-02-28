const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');
const sysselController = require('../../controllers/syssel/sysselController');

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


// MODULES
router.get('/modules', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *, (SELECT COUNT(1) FROM ss_system_module AS bb LEFT JOIN ss_sub_module as cc on bb.sub_module_id = cc.id WHERE cc.module_id = aa.id) as system_count
                    from ss_module as aa
                    ORDER BY module_name;`
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.get('/submodules/:id', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *, (SELECT COUNT(1) FROM ss_system_module AS aa where aa.sub_module_id = a.id) as system_count
                    from ss_sub_module as a
                    where a.module_id = '${req.params.id}'
                    ORDER BY a.sub_module_name`
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.post('/add_module', sysselController.addModule);
router.post('/add_sub_module/:id', sysselController.addSubModule);
router.get('/delete_sub_module/:module_id/:sub_module_id', sysselController.deleteSubModule);

router.get('/module_systems/:id', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT b.id AS system_id,
                    b.system_name
                    FROM ss_system_module AS a
                    LEFT JOIN ss_system AS b ON a.system_id = b.id
                    WHERE a.sub_module_id = '${req.params.id}'
                    ORDER BY b.system_name;`
    let systems = await s.tpQuery(sqlQuery);
    res.json(systems)
})

// SYSTEMS
router.get('/systems', async (req, res) => {
    const order = req.query.order || 'asc';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT COUNT(*) AS total_count FROM ss_system`;
    let recordCount = await s.tpQuery(sqlQuery);
    if (req.query['filter']) {
        filter = JSON.parse(req.query['filter']);
        sqlQuery = `SELECT COUNT(*) AS total_count FROM ss_system AS a WHERE LOWER(a.system_name) LIKE LOWER('%${filter['system_name']}%')`
        recordCount = await s.tpQuery(sqlQuery);
        sqlQuery = `SELECT *, (SELECT COUNT(1) FROM ss_system_vendor as aa where aa.system_id = a.id) as vendor_count
        FROM ss_system AS a
        WHERE LOWER(a.system_name) LIKE LOWER('%${filter['system_name']}%')
        ORDER BY system_name
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY;`;
    } else {
        sqlQuery = `SELECT *, (SELECT COUNT(1) FROM ss_system_vendor as aa where aa.system_id = a.id) as vendor_count
        FROM ss_system AS a
        ORDER BY system_name
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY;`;
    }
    let data = await s.tpQuery(sqlQuery);
    responseJson = {};
    responseJson['total'] = recordCount[0]['total_count'];
    responseJson['rows'] = data;
    res.json(responseJson);
});

router.post('/add_system', sysselController.addSystem);

router.get('/system_vendors/:id', sysselController.systemVendors);
router.post('/add_system_vendors/:id', sysselController.addSystemVendors);
router.get('/delete_system_vendors/:sid/:vid', sysselController.deleteSystemVendors);

router.get('/system_categories/:id', sysselController.systemCategories);
router.post('/add_system_categories/:id', sysselController.addSystemCategories);
router.get('/delete_system_categories/:sid/:vid', sysselController.deleteSystemCategories);

router.get('/system_features/:id', sysselController.systemFeatures);
router.post('/add_system_features/:id', sysselController.addSystemFeatures);
router.get('/delete_system_features/:sid/:vid', sysselController.deleteSystemFeatures);

router.get('/system_modules/:id', sysselController.systemModules);
router.post('/add_system_modules/:id', sysselController.addSystemModules);
router.get('/delete_system_modules/:sid/:vid', sysselController.deleteSystemModules);

module.exports = router;