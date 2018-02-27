const sql = require('../../services/tedious');

// CATEGORIES
exports.categories = (req, res) => {
    res.render('syssel/categories', {
        title: 'System Categories'
    });
}
exports.addCategory = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ss_category (category_name, category_description)
                    OUTPUT inserted.id
                    VALUES ('${req.body.category_name}', '${req.body.category_description}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Category added');
            res.redirect('/syssel/categories');
            return;
        })
        .fail((err) => {
            console.log(err);
            req.flash('danger', err['message']);
            res.redirect('/syssel/categories');
            return;
        })
}

exports.category = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_category WHERE id = '${req.params.id}'`
    let category = await s.tpQuery(sqlQuery);
    category = category[0]
    res.render('syssel/category', {title: 'System Category', category})
}

exports.editCategory = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE ss_category SET category_name = '${req.body.category_name}',
                    category_description = '${req.body.category_description}'
                    WHERE id = '${req.params.id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Category edited');
            res.redirect(`/syssel/category/${req.params.id}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/syssel/category/${req.params.id}`);
        })
}

exports.deleteCategory = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_category WHERE id = '${req.params.id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Category deleted');
            res.redirect('/syssel/categories');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/syssel/categories');
        })
}


// FEATURES
exports.features = (req, res) => {
    res.render('syssel/features', {
        title: 'System Features'
    });
}

exports.addFeature = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ss_feature (feature_name, feature_description)
                    OUTPUT inserted.id
                    VALUES ('${req.body.feature_name}', '${req.body.feature_description}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Feature added');
            res.redirect('/syssel/features');
            return;
        })
        .fail((err) => {
            console.log(err);
            req.flash('danger', err['message']);
            res.redirect('/syssel/features');
            return;
        })
}

exports.feature = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_feature WHERE id = '${req.params.id}'`
    let feature = await s.tpQuery(sqlQuery);
    feature = feature[0]
    res.render('syssel/feature', {title: 'System Feature', feature})
}

exports.editFeature = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE ss_feature SET feature_name = '${req.body.feature_name}',
                    feature_description = '${req.body.feature_description}'
                    WHERE id = '${req.params.id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Feature edited');
            res.redirect(`/syssel/feature/${req.params.id}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/syssel/feature/${req.params.id}`);
        })
}

exports.deleteFeature = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_feature WHERE id = '${req.params.id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Feature deleted');
            res.redirect('/syssel/features');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/syssel/features');
        })
}