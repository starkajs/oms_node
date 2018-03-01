const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');

router.get('/capabilities', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select a.*,
                    (select count(1) from ea_process as aa where aa.capability_id = a.id) as process_count,
                    (select count(1) from ea_metric as aa left join ea_process as bb on aa.process_id = bb.id left join ea_capability as cc on bb.capability_id = cc.id where cc.id = a.id) as metric_count,
                    (select count(1) from ea_solution_requirement as aa left join ea_process as bb on aa.process_id = bb.id left join ea_capability as cc on bb.capability_id = cc.id where cc.id = a.id) as requirement_count
                    from ea_capability as a
                    order by cast(a.short_code as float)
                    `;
    let capabilities = await s.tpQuery(sqlQuery);
    res.json(capabilities);
});

router.get('/capability_processes/:cid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_ea_process WHERE capability_id = '${req.params.cid}' ORDER BY order_column`
    let processes = await s.tpQuery(sqlQuery);
    res.json(processes);
})

router.get('/process_metrics/:pid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ea_metric WHERE process_id = '${req.params.pid}'
                    ORDER BY metric_category, metric_name`
    let metrics = await s.tpQuery(sqlQuery);
    res.json(metrics);
})

router.get('/process_requirements/:pid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ea_solution_requirement WHERE process_id = '${req.params.pid}'`
    let requirements = await s.tpQuery(sqlQuery);
    res.json(requirements);
})

module.exports = router;