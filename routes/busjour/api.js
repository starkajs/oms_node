const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');

router.get('/journeys', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_bj_journey ORDER BY client_name, journey_name`
    let journeys = await s.tpQuery(sqlQuery);
    res.json(journeys);
})

router.get('/journey_projects/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select
                    a.journey_id,
                    a.project_id,
                    b.project_name
                    from bj_journey_project as a
                    left join project as b on a.project_id = b.id
                    WHERE a.journey_id = ${req.params.jid}`
    let projects = await s.tpQuery(sqlQuery);
    res.json(projects);
})

router.post('/add_journey_project/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO bj_journey_project (journey_id, project_id)
                    VALUES ('${req.params.jid}', '${req.body.project}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({message: 'Project added'})
        })
        .fail((err) => {
            res.json({message: 'Error adding the project'})
        })
})

router.get('/journey_capabilities/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select  *
                    from bj_capability as a
                    left join ea_capability as b on a.capability_id = b.id
                    WHERE a.journey_id = ${req.params.jid}
                    order by cast(b.short_code as float)`
    let capabilities = await s.tpQuery(sqlQuery);
    res.json(capabilities);
})


router.get('/journey_solutions/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select  *
                    from bj_solution as a
                    left join ss_system as b on a.system_id = b.id
                    WHERE a.journey_id = ${req.params.jid}
                    order by b.system_name`
    let systems = await s.tpQuery(sqlQuery);
    res.json(systems);
})


router.get('/journey_requirements/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select  *
                    from bj_solution_requirement as a
                    WHERE a.journey_id = ${req.params.jid}`
    let requirements = await s.tpQuery(sqlQuery);
    res.json(requirements);
})

router.get('/journey_scenarios/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    from bj_scenario as a
                    WHERE a.journey_id = ${req.params.jid} ORDER BY a.scenario_name`
    let scenarios = await s.tpQuery(sqlQuery);
    res.json(scenarios);
})

router.get('/journey_vendors/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    FROM vw_bj_vendor as a
                    WHERE a.journey_id = ${req.params.jid} ORDER BY a.vendor_name`
    let vendors = await s.tpQuery(sqlQuery);
    res.json(vendors);
})

router.get('/journey_vendors_score/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    FROM vw_bj_vendor as a
                    WHERE a.journey_id = ${req.params.jid}
                    AND include_in_report = 'Yes'
                    ORDER BY a.vendor_name`
    let vendors = await s.tpQuery(sqlQuery);
    res.json(vendors);
})

router.get('/vendor_status', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM bj_vendor_status ORDER BY status_order`;
    let vendor_status = await s.tpQuery(sqlQuery);
    res.json(vendor_status);
})
router.get('/vendor_reason', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM bj_vendor_reason ORDER BY reason_name`;
    let vendor_reason = await s.tpQuery(sqlQuery);
    res.json(vendor_reason);
})

router.post('/journey_vendor', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE bj_vendor SET ${req.body.update_field} = '${req.body.update_value}'
                    WHERE journey_id = ${req.body.journey_id} AND vendor_id = '${req.body.vendor_id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({
                message: 'Update complete'
            })
        })
        .fail((err) => {
            console.log(err)
            res.json({
                error: err
            })
        })
})

router.post('/add_journey_vendors/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let vendors = req.body.vendors;
    let sqlQuery = '';
    for (vendor in vendors) {
        sqlQuery = `INSERT INTO bj_vendor (journey_id, vendor_id) VALUES ('${req.params.jid}', '${vendors[vendor]}')`
        await s.tpQuery(sqlQuery);
    };
    res.json({message: 'Added vendors'})
})

module.exports = router;