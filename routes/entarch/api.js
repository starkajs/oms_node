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

router.get('/metrics', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT b.short_code+' | '+ b.process_name AS process,
                            c.driver_name,
                            a.*
                    FROM ea_metric AS a
                    LEFT JOIN ea_process AS b ON a.process_id = b.id
                    LEFT JOIN ea_value_driver AS c ON a.value_driver_id = c.id
                    ORDER BY a.metric_category, a.metric_name
                    ;`
    let metrics = await s.tpQuery(sqlQuery);
    res.json(metrics);
})

router.get('/requirements', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_ea_solution_requirement ORDER BY business_capability, process`
    let requirements = await s.tpQuery(sqlQuery);
    res.json(requirements);
})

router.post('/add_metric', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ea_metric (metric_category, metric_name, formula, unit_of_measure, is_key_performance_indicator, process_id, value_driver_id)
                    VALUES ('${req.body.metric_category}', '${req.body.metric_name}', '${req.body.formula}', '${req.body.unit_of_measure}',
                    ${req.body.kpi}, ${req.body.process}, '${req.body.value_driver}')`
    console.log(sqlQuery);
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Metric added');
            res.redirect('/entarch/metrics');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/entarch/metrics');
        })
})

module.exports = router;