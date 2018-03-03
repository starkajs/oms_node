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

exports.freeagent = (req, res) => {
    let fa_url = freeagentAuthUri();
    res.render('optimum/freeagent', {
        title: 'Freeagent Interface', fa_url
    })
}

exports.freeagentCallback = async (req, res) => {
    // 1. Get the code that has been returned
    let code = req.query['code']
    // 2. Get access token from the code
    let auth = "Basic " + new Buffer(keys['FREEAGENT_IDENTIFIER'] + ":" + keys['FREEAGENT_SECRET']).toString("base64");
    var options = { method: 'POST',
    url: 'https://api.freeagent.com/v2/token_endpoint',
    headers:
     {'Cache-Control': 'no-cache',
       Authorization: auth,
       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    formData:
     { grant_type: 'authorization_code',
       code: code,
       redirect_uri: keys['FREEAGENT_REDIRECT_URI'] } };
    await request(options, async (error, response, body) => {
        if (error) throw new Error(error);
        params = JSON.parse(body);
        let updated = await updateFreeagentTokens(params);
    });
    req.flash('success', 'Tokens refreshed');
    res.redirect('/optimum/freeagent');
}

exports.freeagentUsers = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM freeagent`;
    let tokens = await s.tpQuery(sqlQuery);
    let auth = "Bearer " + tokens[0]['access_token'];
    let options = {
        method: 'GET',
        url: 'https://api.freeagent.com/v2/users',
        qs: {per_page: '100', page: '1'},
        headers: {
            'Cache-Control': 'no-cache',
            'User-Agent': 'OMS',
            'Authorization': auth
        }
    };
    await request(options, async (error, response, body) => {
        sqlQuery = `TRUNCATE TABLE temp_users`;
        await s.tpQuery(sqlQuery);
        let users = JSON.parse(body);
        users = users['users'];
        for (user in users) {
            // console.log(users[user]);
            sqlQuery = `INSERT INTO temp_users (url, first_name, last_name, email, role)
                        VALUES ('${users[user]['url']}', '${users[user]['first_name']}', '${users[user]['last_name']}', '${users[user]['email']}', '${users[user]['role']}')`
            // console.log(sqlQuery);
            await s.tpQuery(sqlQuery);
        }
    })
    sqlQuery = `EXECUTE ud_optimum_user`;
    await s.tpQuery(sqlQuery);
    req.flash('success', `Updated complete`);
    res.redirect('/optimum/freeagent');
}

exports.freeagentContacts = async (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM freeagent`;
    let tokens = await s.tpQuery(sqlQuery);
    let auth = "Bearer " + tokens[0]['access_token'];
    let options = {
        method: 'GET',
        url: 'https://api.freeagent.com/v2/contacts',
        qs: {per_page: '100', page: '1', view: 'clients'},
        headers: {
            'Cache-Control': 'no-cache',
            'User-Agent': 'OMS',
            'Authorization': auth
        }
    };
    await request(options, async (error, response, body) => {
        let links = response['headers']['link'];
        if (links) {
            links = links.split(";");
            let starting_point = links[1].indexOf('?');
            let ending_point = links[1].indexOf('&');
            let pages = links[1].substring(starting_point+6, ending_point);
        }
        sqlQuery = `TRUNCATE TABLE temp_clients`;
        await s.tpQuery(sqlQuery);
        let clients = JSON.parse(body);
        clients = clients['contacts'];
        for (client in clients) {
            sqlQuery = `INSERT INTO temp_clients (url, organisation_name, status)
                        VALUES ('${clients[client]['url']}', '${clients[client]['organisation_name']}', '${clients[client]['status']}')`
            await s.tpQuery(sqlQuery);
        }
    })
    sqlQuery = `EXECUTE ud_optimum_client`;
    await s.tpQuery(sqlQuery);
    req.flash('success', `Updated complete`);
    res.redirect('/optimum/freeagent');
}

exports.freeagentProjects = async (req, res) => {
    let auth = await getFreeagentToken();
    let projects = await getFreeagentProjects(auth);
    console.log("project: " + projects);
    req.flash('success', `Updated complete`);
    res.redirect('/optimum/freeagent');
}

const getFreeagentToken = async function() {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM freeagent`;
    let tokens = await s.tpQuery(sqlQuery);
    let auth = "Bearer " + tokens[0]['access_token'];
    return auth;
}

const getFreeagentProjects = async function(auth) {
    console.log("going to get the freeagent projects");
    const s = new sql.sqlServer();
    let sqlQuery = `TRUNCATE TABLE temp_projects`
    await s.tpQuery(sqlQuery);
    let options = {
        method: 'GET',
        url: 'https://api.freeagent.com/v2/projects',
        qs: {per_page: '25', page: '1'},
        headers: {
            'Cache-Control': 'no-cache',
            'User-Agent': 'OMS',
            'Authorization': auth
        },
        resolveWithFullResponse: true
    };
    request(options)
        .then((response) => {
            let links = response['headers']['link'];
            if (links) {
                links = links.split(";");
                let starting_point = links[1].indexOf('?');
                let ending_point = links[1].indexOf('&');
                let pages = links[1].substring(starting_point+6, ending_point);
                console.log(`there are ${pages} pages to be processed`)
                return pages;
            }
        })
        .catch((err) => {
            console.log("err: " + err)
            return err;
        })
}

/*
for (i=1; i<=pages; i++) {
    sqlQuery = `SELECT * FROM freeagent`;
    tokens = await s.tpQuery(sqlQuery);
    auth = "Bearer " + tokens[0]['access_token'];
    let options = {
        method: 'GET',
        url: 'https://api.freeagent.com/v2/projects',
        qs: {per_page: '100', page: i},
        headers: {
            'Cache-Control': 'no-cache',
            'User-Agent': 'OMS',
            'Authorization': auth
        }
    };
    await request(options, async (error, response, body) => {
        let projects = JSON.parse(body);
        projects = projects['projects'];
        for (project in projects) {
            sqlQuery = `INSERT INTO temp_projects (url, name, contact, status)
                        VALUES ('${projects[project]['url']}', '${projects[project]['name']}', '${projects[project]['contact']}', '${projects[project]['status']}')`
            await s.tpQuery(sqlQuery);
        }
    });
}
*/

const getFreeagentTasks = async () => {
    const s = new sql.sqlServer();
    let sqlQuery = `TRUNCATE TABLE temp_tasks`;
    await s.tpQuery(sqlQuery);
    sqlQuery = `SELECT * FROM freeagent`;
    let tokens = await s.tpQuery(sqlQuery);
    let auth = "Bearer " + tokens[0]['access_token'];
    let options = {
        method: 'GET',
        url: 'https://api.freeagent.com/v2/tasks',
        qs: {per_page: '100', page: '1'},
        headers: {
            'Cache-Control': 'no-cache',
            'User-Agent': 'OMS',
            'Authorization': auth
        }
    };
    await request(options, async (error, response, body) => {
        let links = response['headers']['link'];
        if (links) {
            links = links.split(";");
            let starting_point = links[1].indexOf('?');
            let ending_point = links[1].indexOf('&');
            let pages = links[1].substring(starting_point+6, ending_point);
            for (i=1; i<=pages; i++) {
                sqlQuery = `SELECT * FROM freeagent`;
                tokens = await s.tpQuery(sqlQuery);
                auth = "Bearer " + tokens[0]['access_token'];
                let options = {
                    method: 'GET',
                    url: 'https://api.freeagent.com/v2/tasks',
                    qs: {per_page: '100', page: i},
                    headers: {
                        'Cache-Control': 'no-cache',
                        'User-Agent': 'OMS',
                        'Authorization': auth
                    }
                };
                await request(options, async (error, response, body) => {
                    let tasks = JSON.parse(body);
                    tasks = tasks['tasks'];
                    for (task in tasks) {
                        sqlQuery = `INSERT INTO temp_tasks (url, project, name, is_billable, status)
                        VALUES ('${tasks[task]['url']}', '${tasks[task]['project']}', '${tasks[task]['name']}', '${tasks[task]['is_billable']}', '${tasks[task]['status']}')`
                        await s.tpQuery(sqlQuery);
                    }
                })
            }
        }
    })

    return 'Tasks inserted'
}

const updateFreeagentTokens = function(data) {
    const s = new sql.sqlServer();
    let sqlQuery = `UPDATE freeagent SET access_token = '${data['access_token']}', refresh_token = '${data['refresh_token']}'`
    let message = ''
    s.tpQuery(sqlQuery)
        .then(() => {
            message = 'Tokens Updated';
        })
        .fail((err) => {
            console.log(err);
        })
    return message
}

const freeagentAuthUri = () => {
    const params = {
        "client_id": keys['FREEAGENT_IDENTIFIER'],
        "response_type": 'code',
        "redirect_uri": keys['FREEAGENT_REDIRECT_URI'],
    };
    let base = `https://api.freeagent.com/v2/approve_app?`
    let redirect_uri = encodeURIComponent(params['redirect_uri']);
    let url_component = `redirect_uri=${redirect_uri}&response_type=code&client_id=${params['client_id']}`
    let fa_url = base + url_component
    return fa_url;
}


const freeagentSP = async () => {
    const s = new sql.sqlServer();
    sqlQuery = `ud_optimum_project`;
    await s.tpSP(sqlQuery);
    sqlQuery = `ud_optimum_task`;
    await s.tpSP(sqlQuery)
    return 'Complete';
}