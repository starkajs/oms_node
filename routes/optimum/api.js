const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');

router.get('/clients', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_client ORDER BY client_name`
    let clients = await s.tpQuery(sqlQuery);
    res.json(clients);
})

router.post('/add_client', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO client (client_name, url, erp_id, crm_id, email)
                    VALUES ('${req.body.client_name}', '${req.body.url}',
                    '${req.body.erp_id}', '${req.body.crm_id}', '${req.body.email}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Client added');
            res.redirect('/optimum/clients')
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/optimum/clients')
        })
})

router.get('/client_projects/:cid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM project WHERE client_id = '${req.params.cid}' ORDER BY project_name`
    let projects = await s.tpQuery(sqlQuery);
    res.json(projects);
})


router.get('/client_journeys/:cid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM bj_journey WHERE client_id = '${req.params.cid}' ORDER BY journey_name`
    let journeys = await s.tpQuery(sqlQuery);
    res.json(journeys);
})

router.post('/add_client_journey/:cid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO bj_journey (client_id, journey_name)
                    VALUES ('${req.params.cid}', '${req.body.journey_name}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({message: 'Added journey'})
        })
        .fail((err) => {
            req.json({message: err['message']});
        })
})

router.post('/add_client_project/:cid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO project (client_id, project_name)
                    VALUES ('${req.params.cid}', '${req.body.project_name}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({message: 'Added journey'})
        })
        .fail((err) => {
            req.json({message: err['message']});
        })
})

router.get('/projects', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_project ORDER BY client_name, project_name`;
    let projects = await s.tpQuery(sqlQuery);
    res.json(projects);
})

router.get('/project_tasks/:pid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM project_task WHERE project_id = '${req.params.pid}'`
    let tasks = await s.tpQuery(sqlQuery);
    res.json(tasks);
})

router.post('/add_project_task/:pid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO project_task (project_id, task_name)
                    VALUES ('${req.params.pid}', '${req.body.task_name}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({message: 'Added task'})
        })
        .fail((err) => {
            req.json({message: err['message']});
        })
})

module.exports = router;