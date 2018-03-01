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


// MODULES AND SUB-MODULES
exports.modules = (req, res) => {
    res.render('syssel/modules', {
        title: 'System Modules'
    });
}

exports.addModule = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ss_module (module_name, module_description)
                    OUTPUT inserted.id
                    VALUES ('${req.body.module_name}', '${req.body.module_description}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Module added');
            res.redirect('/syssel/modules');
            return;
        })
        .fail((err) => {
            console.log(err);
            req.flash('danger', err['message']);
            res.redirect('/syssel/modules');
            return;
        })
}

exports.addSubModule = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ss_sub_module (module_id, sub_module_name, sub_module_description)
                    VALUES ('${req.params.id}', '${req.body.sub_module_name}', '${req.body.sub_module_description}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Module added');
            res.redirect(`/syssel/module/${req.params.id}`);
            return;
        })
        .fail((err) => {
            console.log(err);
            req.flash('danger', err['message']);
            res.redirect(`/syssel/module/${req.params.id}`);
            return;
        })
}

exports.module = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_module WHERE id = '${req.params.id}'`
    let ss_module = await s.tpQuery(sqlQuery);
    ss_module = ss_module[0]
    res.render('syssel/module', {title: 'System Module', ss_module})
}

exports.editModule = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE ss_module SET module_name = '${req.body.module_name}',
                    module_description = '${req.body.module_description}'
                    WHERE id = '${req.params.id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Module edited');
            res.redirect(`/syssel/module/${req.params.id}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/syssel/module/${req.params.id}`);
        })
}

exports.deleteModule = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_module WHERE id = '${req.params.id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Module deleted');
            res.redirect('/syssel/modules');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/syssel/modules');
        })
}


exports.deleteSubModule = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_sub_module WHERE id = '${req.params.sub_module_id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Module deleted');
            res.redirect(`/syssel/module/${req.params.module_id}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/syssel/module/${req.params.module_id}`);
        })
}


exports.subModule = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_sub_module WHERE id = '${req.params.id}'`
    let ss_sub_module = await s.tpQuery(sqlQuery);
    ss_sub_module = ss_sub_module[0]
    res.render('syssel/submodule', {title: 'System Sub-Module', ss_sub_module})
}

exports.editSubModule = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE ss_sub_module SET sub_module_name = '${req.body.sub_module_name}',
                    sub_module_description = '${req.body.sub_module_description}'
                    WHERE id = '${req.params.id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'SubModule edited');
            res.redirect(`/syssel/submodule/${req.params.id}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/syssel/submodule/${req.params.id}`);
        })
}


// SYSTEMS
exports.systems = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_category ORDER BY category_name`
    let categories = await s.tpQuery(sqlQuery)
    sqlQuery = `SELECT * FROM ss_feature ORDER BY feature_name`
    let features = await s.tpQuery(sqlQuery)
    sqlQuery = `select
                b.module_name,
                a.id as sub_module_id,
                a.sub_module_name
                from ss_sub_module as a
                left join ss_module as b on a.module_id = b.id
                order by b.module_name, a.sub_module_name`
    let sys_modules = await s.tpQuery(sqlQuery)
    res.render('syssel/systems', {
        title: 'Systems', categories, features, sys_modules
    });
}

exports.addSystem = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ss_system (system_name, system_url, system_description)
                    VALUES ('${req.body.system_name}', '${req.body.system_url}', '${req.body.system_description}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'System added');
            res.redirect('/syssel/systems');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/syssel/systems');
        })
}

exports.deleteSystem = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_system WHERE id = '${req.params.id}'`;
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'System deleted');
            res.redirect('/syssel/systems');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/syssel/systems')
        })
}

exports.system = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_system WHERE id = '${req.params.id}'`
    let system = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM ss_vendor
                WHERE id NOT IN (SELECT vendor_id FROM ss_system_vendor WHERE system_id = '${req.params.id}')
                ORDER BY vendor_name`
    let vendors = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM ss_category
                WHERE id NOT IN (SELECT category_id FROM ss_system_category WHERE system_id = '${req.params.id}')
                ORDER BY category_name`
    let categories = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM ss_feature
                WHERE id NOT IN (SELECT feature_id FROM ss_system_feature WHERE system_id = '${req.params.id}')
                ORDER BY feature_name`
    let features = await s.tpQuery(sqlQuery);
    sqlQuery = `select
                b.module_name,
                a.*
                from ss_sub_module as a
                left join ss_module as b on a.module_id = b.id
                where a.id not in (select sub_module_id from ss_system_module where system_id = '${req.params.id}')
                ORDER BY b.module_name, a.sub_module_name
                `
    let sys_modules = await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM currency ORDER BY currency_name`
    let currencies = await s.tpQuery(sqlQuery);
    system = system[0]
    res.render('syssel/system', {
        title: 'System', system, vendors, categories, features, sys_modules, currencies
    })
}

exports.editSystem = (req, res) => {
    const s = new sql.sqlServer();
    system_id = req.params.id;
    let sqlQuery = `UPDATE ss_system SET system_name = '${req.body.system_name}',
                    system_url = '${req.body.system_url}', system_description = '${req.body.system_description}',
                    optimum_view = '${req.body.optimum_view}', average_implementation_months = ${req.body.average_implementation_months},
                    current_installations = ${req.body.current_installations}, current_users = ${req.body.current_users},
                    is_saas = ${req.body.is_saas}, currency  = '${req.body.currency}', pricing_comment = '${req.body.pricing_comment}',
                    initial_licence_cost = ${req.body.initial_licence_cost}, price_per_user_annual = ${req.body.price_per_user_annual},
                    annual_maintenance_cost = ${req.body.annual_maintenance_cost}
                    WHERE id = '${system_id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'System updatd');
            res.redirect(`/syssel/system/${req.params.id}`)
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/syssel/system/${req.params.id}`)
        })
}

exports.systemVendors = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    from ss_system_vendor as a
                    left join ss_vendor as b on a.vendor_id = b.id
                    where a.system_id = '${req.params.id}' ORDER BY b.vendor_name`
    let vendors = await s.tpQuery(sqlQuery);
    res.json(vendors);
}

exports.addSystemVendors = async (req, res) => {
    const s = new sql.sqlServer();
    let system_id = req.params.id;
    let vendors = req.body.vendors;
    let sqlQuery = '';
    for (vendor in vendors) {
        sqlQuery = `INSERT INTO ss_system_vendor (system_id, vendor_id)
                    VALUES ('${system_id}', '${vendors[vendor]}')`
        let done = await s.tpQuery(sqlQuery);
    }
    res.json({message: 'updated'})
}

exports.deleteSystemVendors = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_system_vendor WHERE system_id = '${req.params.sid}' AND vendor_id = '${req.params.vid}'`
    let done = await s.tpQuery(sqlQuery);
    req.flash('success', 'Vendor/System removed');
    res.redirect(`/syssel/system/${req.params.sid}`);
}

exports.systemCategories = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    from ss_system_category as a
                    left join ss_category as b on a.category_id = b.id
                    where a.system_id = '${req.params.id}' ORDER BY b.category_name`
    let categories = await s.tpQuery(sqlQuery);
    res.json(categories);
}

exports.addSystemCategories = async (req, res) => {
    const s = new sql.sqlServer();
    let system_id = req.params.id;
    let categories = req.body.categories;
    let sqlQuery = '';
    for (category in categories) {
        sqlQuery = `INSERT INTO ss_system_category (system_id, category_id)
                    VALUES ('${system_id}', '${categories[category]}')`
        let done = await s.tpQuery(sqlQuery);
    }
    res.json({message: 'updated'})
}

exports.deleteSystemCategories = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_system_category WHERE system_id = '${req.params.sid}' AND category_id = '${req.params.vid}'`
    let done = await s.tpQuery(sqlQuery);
    req.flash('success', 'Category removed');
    res.redirect(`/syssel/system/${req.params.sid}`);
}

exports.systemFeatures = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    from ss_system_feature as a
                    left join ss_feature as b on a.feature_id = b.id
                    where a.system_id = '${req.params.id}' ORDER BY b.feature_name`
    let features = await s.tpQuery(sqlQuery);
    res.json(features);
}

exports.addSystemFeatures = async (req, res) => {
    const s = new sql.sqlServer();
    let system_id = req.params.id;
    let features = req.body.features;
    console.log(features);
    let sqlQuery = '';
    for (feature in features) {
        sqlQuery = `INSERT INTO ss_system_feature (system_id, feature_id)
                    VALUES ('${system_id}', '${features[feature]}')`
        let done = await s.tpQuery(sqlQuery);
    }
    res.json({message: 'updated'})
}

exports.deleteSystemFeatures = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_system_feature WHERE system_id = '${req.params.sid}' AND feature_id = '${req.params.vid}'`
    let done = await s.tpQuery(sqlQuery);
    req.flash('success', 'Feature removed');
    res.redirect(`/syssel/system/${req.params.sid}`);
}

exports.systemModules = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select a.sub_module_id as id, c.module_name + ' | ' + b.sub_module_name as module_name
                    from ss_system_module as a
                    left join ss_sub_module as b on a.sub_module_id = b.id
                    left join ss_module as c on b.module_id = c.id
                    where a.system_id = '${req.params.id}' ORDER BY c.module_name, b.sub_module_name`
    let modules = await s.tpQuery(sqlQuery);
    res.json(modules);
}

exports.addSystemModules = async (req, res) => {
    const s = new sql.sqlServer();
    let system_id = req.params.id;
    let modules = req.body.modules;
    let sqlQuery = '';
    for (sys_module in modules) {
        sqlQuery = `INSERT INTO ss_system_module (system_id, sub_module_id)
                    VALUES ('${system_id}', '${modules[sys_module]}')`
        let done = await s.tpQuery(sqlQuery);
    }
    res.json({message: 'updated'})
}

exports.deleteSystemModules = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_system_module WHERE system_id = '${req.params.sid}' AND sub_module_id = '${req.params.vid}'`
    let done = await s.tpQuery(sqlQuery);
    req.flash('success', 'Module removed');
    res.redirect(`/syssel/system/${req.params.sid}`);
}


// VENDORS

exports.vendors = async (req, res) => {
    res.render('syssel/vendors', {
        title: 'Vendors'
    });
}

exports.addVendor = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO ss_vendor (vendor_name, vendor_url, company_profile)
                    VALUES ('${req.body.vendor_name}', '${req.body.vendor_url}', '${req.body.company_profile}')`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Vendor added');
            res.redirect('/syssel/vendors');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/syssel/vendors');
        })
}

exports.deleteVendor = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_vendor WHERE id = '${req.params.id}'`;
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Vendor deleted');
            res.redirect('/syssel/vendors');
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect('/syssel/vendors')
        })
}

exports.viewVendor = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_vendor WHERE id = '${req.params.id}'`
    let vendor = await s.tpQuery(sqlQuery);
    vendor = vendor[0]
    // countries
    sqlQuery = `SELECT * FROM country ORDER BY country_name`
    let countries = await s.tpQuery(sqlQuery);
    // industries
    sqlQuery = `select *
                from trbc
                where classification_type = 'Industry Group'
                and id not in (
                    select industry_id
                    from ss_vendor_industry
                    where vendor_id = '${req.params.id}'
                ) ORDER BY classification_name;`
    let industries = await s.tpQuery(sqlQuery);
    // locations
    sqlQuery = `SELECT * FROM ss_vendor_location WHERE vendor_id = '${req.params.id}' ORDER BY country_code, region, city`
    let locations = await s.tpQuery(sqlQuery)
    res.render('syssel/vendor', {
        title: 'Vendor', vendor, industries, locations, countries
    })
}

exports.getVendorSystemsList = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                from ss_system
                WHERE id not in (
                    select system_id
                    from ss_system_vendor
                    where vendor_id = '${req.params.vid}'
                ) ORDER BY system_name;`
    let systems = await s.tpQuery(sqlQuery);
    res.json(systems);
}

exports.vendorSystems = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    from ss_system_vendor as a
                    left join ss_system as b on a.system_id = b.id
                    where a.vendor_id = '${req.params.id}' ORDER BY b.system_name`
    let systems = await s.tpQuery(sqlQuery);
    res.json(systems);
}

exports.addVendorSystems = async (req, res) => {
    const s = new sql.sqlServer();
    let vendor_id = req.params.id;
    let systems = req.body.systems;
    let sqlQuery = '';
    for (system in systems) {
        sqlQuery = `INSERT INTO ss_system_vendor (vendor_id, system_id)
                    VALUES ('${vendor_id}', '${systems[system]}')`
        let done = await s.tpQuery(sqlQuery);
    }
    res.json({message: 'updated'})
}

exports.deleteVendorSystems = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_system_vendor WHERE system_id = '${req.params.sid}' AND vendor_id = '${req.params.vid}'`
    let done = await s.tpQuery(sqlQuery);
    req.flash('success', 'Vendor/System removed');
    res.redirect(`/syssel/vendor/${req.params.vid}`);
}

exports.vendorIndustries = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    from ss_vendor_industry as a
                    left join trbc as b on a.industry_id = b.id
                    where a.vendor_id = '${req.params.id}' ORDER BY b.classification_name`
    let industries = await s.tpQuery(sqlQuery);
    res.json(industries);
}

exports.addVendorIndustries = async (req, res) => {
    const s = new sql.sqlServer();
    let vendor_id = req.params.id;
    let industries = req.body.industries;
    let sqlQuery = '';
    for (industry in industries) {
        sqlQuery = `INSERT INTO ss_vendor_industry (vendor_id, industry_id)
                    VALUES ('${vendor_id}', '${industries[industry]}')`
        let done = await s.tpQuery(sqlQuery);
    }
    res.json({message: 'updated'})
}

exports.deleteVendorIndustries = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_vendor_industry WHERE vendor_id = '${req.params.vid}' AND industry_id = '${req.params.iid}'`
    let done = await s.tpQuery(sqlQuery);
    req.flash('success', 'Vendor/Industry removed');
    res.redirect(`/syssel/vendor/${req.params.vid}`);
}

exports.vendorLocations = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select a.id as location_id, a.country_code + ' | ' + a.region + ' | ' + a.city as location_description
                    from ss_vendor_location as a
                    where a.vendor_id = '${req.params.id}' ORDER BY a.country_code, a.region, a.city`
    let locations = await s.tpQuery(sqlQuery);
    res.json(locations);
}

exports.addVendorLocation = async (req, res) => {
    const s = new sql.sqlServer();
    let vendor_id = req.params.id;
    let sqlQuery = `INSERT INTO ss_vendor_location (vendor_id, country_code, region, city)
                VALUES ('${vendor_id}', '${req.body.country}', '${req.body.region}', '${req.body.city}')`
    let done = await s.tpQuery(sqlQuery);
    res.json({message: 'updated'})
}

exports.deleteVendorLocations = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `DELETE FROM ss_vendor_location WHERE vendor_id = '${req.params.vid}' AND id = '${req.params.lid}'`
    let done = await s.tpQuery(sqlQuery);
    req.flash('success', 'Vendor/Location removed');
    res.redirect(`/syssel/vendor/${req.params.vid}`);
}


exports.editVendor = (req, res) => {
    const s = new sql.sqlServer();
    vendor_id = req.params.id;
    let sqlQuery = `UPDATE ss_vendor SET vendor_name = '${req.body.vendor_name}',
                    vendor_url = '${req.body.vendor_url}', sales_email = '${req.body.sales_email}',
                    company_profile = '${req.body.company_profile}', optimum_view = '${req.body.optimum_view}',
                    contact_name = '${req.body.contact_name}', contact_email = '${req.body.contact_email}',
                    support_247 = ${req.body.support_247}, support_locations = '${req.body.support_locations}',
                    is_uk_based = '${req.body.is_uk_based}', is_eu_based = '${req.body.is_eu_based}',
                    is_iso_9001 = ${req.body.is_iso_9001}, is_iso_27001 = ${req.body.is_iso_27001}, is_gdpr = ${req.body.is_gdpr}
                    WHERE id = '${vendor_id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Vendor updated');
            res.redirect(`/syssel/vendor/${req.params.id}`)
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/syssel/vendor/${req.params.id}`)
        })
}