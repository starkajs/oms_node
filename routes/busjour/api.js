const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const csv = require('csvtojson');


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

router.get('/processes', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_ea_process ORDER BY order_column`
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.get('/features', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM ss_feature ORDER BY feature_name`
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.get('/modules', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM vw_ss_module WHERE sub_module_name is not null ORDER BY module_name, sub_module_name`
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.get('/moscow', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM moscow ORDER BY moscow`
    let moscow = await s.tpQuery(sqlQuery);
    res.json(moscow);
})

router.post('/add_journey_requirements/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = ''
    for (requirement in req.body.requirements) {
        sqlQuery = `insert into bj_solution_requirement (journey_id, requirement_id, process_id, sub_module_id, requirement)
                    select ${req.params.jid}, id, process_id, sub_module_id, requirement
                    from ea_solution_requirement where id = ${req.body.requirements[requirement]}`
        await s.tpQuery(sqlQuery)
    };
    res.json({message: 'Update complete'})
})

router.post('/add_requirement/:jid', async (req, res) => {
    if (req.body.module) {
        let ss_module = `'${req.body.module}'`;
    } else {
        ss_module = 'NULL'
    }
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO bj_solution_requirement (journey_id, process_id, requirement, moscow, sub_module_id, example)
                    VALUES (${req.params.jid}, ${req.body.process}, '${req.body.requirement}', '1 - Must Have', ${ss_module},
                    '${req.body.example}')`
    console.log(sqlQuery);
    s.tpQuery(sqlQuery)
        .then(() => {
            req.flash('success', 'Added requirement');
            res.redirect(`/journey/journey_requirements/${req.params.jid}`)
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/journey/journey_requirements/${req.params.jid}`)
        })
})

router.post('/create_standard', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `insert into ea_solution_requirement (process_id, sub_module_id, requirement)
                    output inserted.id
                    select process_id, sub_module_id, requirement
                    from bj_solution_requirement
                    where journey_id = ${req.body.journey}
                    and id = ${req.body.requirement}`
    let new_id = await s.tpQuery(sqlQuery);
    sqlQuery = `UPDATE bj_solution_requirement SET requirement_id = ${new_id[0]['id']}
                WHERE journey_id = ${req.body.journey} AND id = ${req.body.requirement}`
    await s.tpQuery(sqlQuery);
    res.json({data: 'updated'});
})

router.get('/requirements_responses/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery =`SELECT * FROM vw_bj_requirements_responses WHERE journey_id = ${req.params.jid}`
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.post('/add_vendor_requirements/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = ''
    for (vendor in req.body.vendors) {
        sqlQuery = `insert into bj_solution_requirement_response (solution_requirement_id, vendor_id, journey_id, update_required)
                    select id, '${req.body.vendors[vendor]}', ${req.params.jid}, 0
                    from bj_solution_requirement
                    where journey_id = ${req.params.jid}`
        await s.tpQuery(sqlQuery)
    }
    res.json({message: 'Vendors added'})
})

router.post('/upload_responses/:jid', async (req, res) => {

    let sqlQuery = '';
    let form = new formidable.IncomingForm();
    form.multiples = false;
    let uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads');
    form.uploadDir = uploadPath;
    let filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'responses.csv');
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        console.log("file doesn't exist: ", error);
    }
    form.on('file', function(field, file){
        fs.rename(file.path, path.join(form.uploadDir, 'responses.csv'));
    });
    form.on('error', function(err){
        console.log("Error: ", err);
    });
    form.on('end', function(){
        csv()
            .fromFile(filePath)

            .on('end_parsed', async (data) => {
                const s = new sql.sqlServer();
                for (record in data) {
                sqlQuery = `UPDATE bj_solution_requirement_response
                            SET response_value = ${data[record]['Response']}, response_comment = '${data[record]['Comment']}'
                            WHERE solution_requirement_id = ${data[record]['ID']} AND vendor_id = '${data[record]['Vendor ID']}'`
                console.log("--- --- ---")
                console.log(data[record['ID']]);
                console.log(sqlQuery);
                await s.tpQuery(sqlQuery)
                }
            })
        req.flash('success', 'File uploaded and responses updated');
        res.redirect(`/journey/requirements_responses/${req.params.jid}`);
    })
    form.parse(req);
});

router.get('/categories', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `select a.*,
                    (select count(1) from bj_evaluation_question as aa where aa.category_id = a.id) as question_count
                    from bj_evaluation_category as a ORDER BY a.category_name`;
    let categories = await s.tpQuery(sqlQuery);
    res.json(categories);
})

router.get('/questions/:cid', async (req, res) => {;
    const s = new sql.sqlServer();
    let sqlQuery = `select *
                    from bj_evaluation_question as a
                    WHERE a.category_id = '${req.params.cid}'`
    let questions = await s.tpQuery(sqlQuery);
    res.json(questions);
})

router.post('/add_question/:cid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `INSERT INTO bj_evaluation_question (category_id, evaluation_question, question_type)
                    OUTPUT INSERTED.id
                    VALUES ('${req.params.cid}', '${(req.body.evaluation_question).replace("'", "")}' ,'${req.body.question_type}')`
    s.tpQuery(sqlQuery)
        .then((response) => {
            req.flash('success', `Question inserted with id ${response[0]['id']}`);
            res.redirect(`/journey/questions/${req.params.cid}`);
        })
        .fail((err) => {
            req.flash('danger', err['message']);
            res.redirect(`/journey/questions/${req.params.cid}`);
        })
})

router.post('/evaluation_question', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE bj_evaluation_question SET ${req.body.update_field} = '${(req.body.update_value).replace("'", "")}'
                    WHERE id = ${req.body.question_id}`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({success: 'successfully updated'})
        })
        .fail((err) => {
            res.json({error: err['message']})
        })

})

router.get('/journey_evaluation/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM bj_evaluation_weight
                    AS a left join bj_evaluation_category as b on a.category_id = b.id
                    WHERE a.journey_id = ${req.params.jid}
                    ORDER BY b.category_name`;
    let data = await s.tpQuery(sqlQuery);
    res.json(data);
})

router.post('/evaluation_weight', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE bj_evaluation_weight SET ${req.body.update_field} = ${req.body.update_value}
                    WHERE journey_id = ${req.body.journey_id} AND category_id = '${req.body.category_id}'`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({success: 'successfully updated'})
        })
        .fail((err) => {
            res.json({error: err['message']})
        })

})

router.post('/populate_evaluation/:jid', async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `insert into bj_evaluation_weight (journey_id, category_id)
                    select ${req.params.jid}, id
                    from bj_evaluation_category
                    where id not in (select category_id from bj_evaluation_weight where journey_id = ${req.params.jid})`
    s.tpQuery(sqlQuery)
        .then(() => {
            res.json({success: 'successfully updated'})
        })
        .fail((err) => {
            res.json({error: err['message']})
        })
})

module.exports = router;