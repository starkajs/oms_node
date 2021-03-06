const sql = require('../../services/tedious');


exports.journeys = (req, res) => {
    res.render('busjour/journeys', {
        title: 'Business Journeys'
    })
}

exports.journey = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_bj_journey WHERE id = ${req.params.jid}`
    let journey = await s.tpQuery(sqlQuery);
    sqlQuery = `select a.client_id, b.id as project_id, b.project_name
                from bj_journey as a
                left join project as b on a.client_id = b.client_id
                WHERE a.id = ${req.params.jid}
                AND b.id not in (select aa.project_id from bj_journey_project as aa WHERE aa.journey_id = a.id)`
    let projects = await s.tpQuery(sqlQuery)
    res.render('busjour/journey', {
        title: 'Business Journey', journey: journey[0], projects
    })
}

exports.vendors = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_bj_journey WHERE id = ${req.params.jid}`
    let journey = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM ss_vendor WHERE id not in (SELECT vendor_id FROM bj_vendor WHERE journey_id = ${req.params.jid}) ORDER BY vendor_name`
    let vendors = await s.tpQuery(sqlQuery);
    res.render('busjour/vendors', {
        title: 'Journey Vendors', journey: journey[0], vendors
    })
}

exports.journeyVendorsScore = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_bj_journey WHERE id = ${req.params.jid}`
    let journey = await s.tpQuery(sqlQuery);
    res.render('busjour/journey_vendors_score', {
        title: 'Journey Vendors', journey: journey[0]
    })
}

exports.requirements = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_bj_journey WHERE id = ${req.params.jid}`
    let journey = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT *
                FROM vw_ea_solution_requirement
                WHERE id not in (SELECT distinct requirement_id FROM bj_solution_requirement WHERE journey_id = ${req.params.jid} and requirement_id is not null)`
    let requirements = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT id, process, order_column FROM vw_ea_process ORDER BY order_column`;
    let processes = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM vw_ss_module WHERE sub_module_name is not null ORDER BY module_name, sub_module_name`;
    let modules = await s.tpQuery(sqlQuery);
    res.render('busjour/requirements', {
        title: 'Journey Requirements', journey: journey[0], requirements, processes, modules
    })
}

exports.requirementsResponses = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_bj_journey WHERE id = ${req.params.jid}`
    let journey = await s.tpQuery(sqlQuery);
    sqlQuery = `select
                b.vendor_name,
                a.vendor_id,
                a.journey_id,
                c.status_name
                from bj_vendor as a
                left join ss_vendor as b on a.vendor_id = b.id
                left join bj_vendor_status as c on a.status_id = c.id
                WHERE journey_id = ${req.params.jid}
                AND a.vendor_id not in (SELECT DISTINCT vendor_id FROM bj_solution_requirement_response WHERE journey_id = ${req.params.jid})
                ORDER BY b.vendor_name`
    let vendors = await s.tpQuery(sqlQuery);
    res.render('busjour/requirements_responses', {
        title: 'Journey Requirements', journey: journey[0], vendors
    })
}

exports.evaluationCategories = async (req, res) => {
    res.render('busjour/categories', {
        title: 'Evaluation Categories'
    })
}

exports.category = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM bj_evaluation_category WHERE id = '${req.params.cid}'`
    let category = await s.tpQuery(sqlQuery);
    res.render('busjour/category', {
        title: 'Evaluation Category', category: category[0]
    })
}

exports.editCategory = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE bj_evaluation_category SET category_name = '${req.body.category_name}',
                    category_description = '${(req.body.category_description).replace("'", "")}' WHERE id = '${req.params.cid}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Category updated');
            res.redirect(`/journey/category/${req.params.cid}`)
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/journey/category/${req.params.cid}`)
        })

}

exports.questions = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM bj_evaluation_category WHERE id = '${req.params.cid}'`
    let category = await s.tpQuery(sqlQuery);
    res.render('busjour/questions', {
        title: 'Evaluation Questions', category: category[0]
    })
}

exports.journeyVendor = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_bj_journey WHERE id = ${req.params.jid}`
    let journey = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM bj_vendor AS a left join ss_vendor AS b on a.vendor_id = b.id WHERE a.vendor_id = '${req.params.vid}'`
    let vendor = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM bj_evaluation_category ORDER BY category_name`
    let categories = await s.tpQuery(sqlQuery);
    res.render('busjour/vendor_response', {
        title: 'Vendor', journey: journey[0], vendor: vendor[0], categories
    })
}