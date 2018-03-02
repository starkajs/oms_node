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