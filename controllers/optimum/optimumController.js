const sql = require('../../services/tedious');
const keys = require('../../config/keys');
const request = require('request-promise');
const url = require('url');

exports.clients = async (req, res) => {
    res.render('optimum/clients', {title: 'Clients'})
}

exports.client = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM client WHERE id = '${req.params.cid}'`
    let client = await s.tpQuery(sqlQuery)
    res.render('optimum/client', {
        title: 'Client', client: client[0]
    })
}

exports.editClient = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE client SET client_name = '${req.body.client_name}',
                    url = '${req.body.url}', email = '${req.body.email}',
                    erp_id = '${req.body.erp_id}', crm_id = '${req.body.crm_id}'
                    WHERE id = '${req.params.cid}'`
    console.log(sqlQuery);
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Client updated');
            res.redirect(`/optimum/client/${req.params.cid}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/optimum/client/${req.params.cid}`);
        })
}

exports.projects = async (req, res) => {
    res.render('optimum/projects', {title: 'Projects'})
}

exports.project = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_project WHERE id = '${req.params.pid}'`
    let project = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM project_type ORDER BY project_type_name`;
    let project_types = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM project_area ORDER BY project_area_name`;
    let project_areas = await s.tpQuery(sqlQuery);
    res.render('optimum/project', {
        title: 'Project', project: project[0], project_types, project_areas
    })
}

exports.editProject = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE project SET project_name = '${req.body.project_name}', project_type_id = '${req.body.project_type_id}',
                    project_area_id = '${req.body.project_area_id}', erp_id = '${req.body.erp_id}', crm_id = '${req.body.crm_id}',
                    is_internal_project = ${req.body.is_internal_project}, project_status = '${req.body.project_status}'
                    WHERE id = '${req.params.pid}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Project updated');
            res.redirect(`/optimum/project/${req.params.pid}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/optimum/project/${req.params.pid}`);
        })
}

exports.prime = async (req, res) => {
    res.render('optimum/prime', {
        title: 'PRIME Phases'
    })
}