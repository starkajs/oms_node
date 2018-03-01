const sql = require('../../services/tedious');

exports.capabilities = async (req, res) => {
    res.render('entarch/capabilities', {
        title: 'Business Capabilities'
    })
}

exports.capability = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ea_capability where id = '${req.params.cid}'`
    let capability = await s.tpQuery(sqlQuery);
    res.render('entarch/capability', {
        title: 'Business Capability',
        capability: capability[0]
    })
}

exports.editCapability = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE ea_capability SET short_code = '${req.body.short_code}',
                    capability_name = '${req.body.capability_name}', capability_description = '${req.body.capability_description}'
                    WHERE id = '${req.params.cid}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Capability updated');
            res.redirect(`/entarch/capability/${req.params.cid}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/entarch/capability/${req.params.cid}`);
        })
}

exports.addProcess = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ea_process (process_level, short_code, process_name, capability_id)
                    VALUES ('${req.body.process_level}', '${req.body.short_code}', '${req.body.process_name}', '${req.params.cid}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Process added');
            res.redirect(`/entarch/capability/${req.params.cid}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/entarch/capability/${req.params.cid}`);
        })
}

exports.eaProcess = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ea_process WHERE id = '${req.params.pid}'`
    let ea_process = await s.tpQuery(sqlQuery);
    res.render('entarch/process', {
        title: 'Process', ea_process: ea_process[0]
    })
}

exports.editProcess = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE ea_process SET process_level = '${req.body.process_level}',
                    short_code = '${req.body.short_code}', process_name = '${req.body.process_name}',
                    process_description = '${req.body.process_description}' WHERE id = ${req.params.pid}`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Process updated');
            res.redirect(`/entarch/process/${req.params.pid}`)
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/entarch/process/${req.params.pid}`)
        })
}

exports.metrics = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT DISTINCT unit_of_measure FROM ea_metric ORDER BY unit_of_measure`;
    let units = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT id, process, order_column FROM vw_ea_process ORDER BY order_column;`;
    let processes = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM ea_value_driver ORDER BY driver_name;`
    let drivers = await s.tpQuery(sqlQuery);
    res.render('entarch/metrics', {
        title: 'Metrics', units, processes, drivers
    })
}

exports.metric = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ea_metric WHERE id = ${req.params.mid}`
    let metric = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT DISTINCT metric_category FROM ea_metric ORDER BY metric_category`;
    let categories = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM vw_ea_process ORDER BY order_column`;
    let processes = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM ea_value_driver ORDER BY driver_name`;
    let drivers = await s.tpQuery(sqlQuery);
    res.render('entarch/metric', {
        title: 'Metric', metric: metric[0], categories, processes, drivers
    })
}

exports.editMetric = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE ea_metric SET value_driver_id = '${req.body.value_driver}',
                    metric_category = '${req.body.metric_category}', metric_name = '${req.body.metric_name}',
                    formula = '${req.body.formula}', process_id = ${req.body.process || 'NULL'}, is_key_performance_indicator = ${req.body.kpi},
                    lead_lag = '${req.body.lead_lag}'
                    WHERE id = ${req.params.mid}`
    console.log(sqlQuery);
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Metric updated');
            res.redirect(`/entarch/metric/${req.params.mid}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/entarch/metric/${req.params.mid}`);
        })
}

exports.requirements = (req, res) => {
    res.render('entarch/requirements', {title: 'Standard Solution Requirements'})
}