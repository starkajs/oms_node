const sql = require('../../services/tedious');

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