const sql = require('../../services/tedious');
const keys = require('../../config/keys');
const rp = require('request-promise');
const url = require('url');

exports.freeagent = (req, res) => {
    let fa_url = freeagentAuthUri();
    res.render('optimum/freeagent', {
        title: 'Freeagent Interface', fa_url
    })
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
exports.freeagentCallback = (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = '';
    // 1. Get the code that has been returned
    let code = req.query['code']
    // 2. Get access token from the code
    let auth = "Basic " + new Buffer(keys['FREEAGENT_IDENTIFIER'] + ":" + keys['FREEAGENT_SECRET']).toString("base64");
    var options = {
        resolveWithFullResponse: true,
        method: 'POST',
    url: 'https://api.freeagent.com/v2/token_endpoint',
    headers:
     {'Cache-Control': 'no-cache',
       Authorization: auth,
       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    formData:
     { grant_type: 'authorization_code',
       code: code,
       redirect_uri: keys['FREEAGENT_REDIRECT_URI'] } };
    rp(options)
        .then((response) => {
            let params = JSON.parse(response['body']);
            return params;
        })
        .then((params) => {
            console.log("50:", params);
            sqlQuery = `UPDATE freeagent SET access_token = '${params['access_token']}', refresh_token = '${params['refresh_token']}' OUTPUT 'TOKENS UPDATED' as message`
            s.tpQuery(sqlQuery)
                .then((response) => {
                    req.flash('success', response[0]['message']);
                    res.redirect('/optimum/freeagent');
                })
                .fail((err) => {
                    req.flash('danger', err);
                    res.redirect('/optimum/freeagent');
                })
        })
        .catch((err) => {
            req.flash('danger', err);
            res.redirect('/optimum/freeagent');
        })
}
exports.freeagentContacts = (req, res) => {
    const s = new sql.sqlServer();
    let per_page = 100;
    // get the tokens and clear temp_clients at the same time
    let sqlQuery = `SELECT * FROM freeagent;TRUNCATE TABLE temp_clients`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            let auth = "Bearer " + data[0]['access_token'];
            let options = {
                method: 'GET',
                url: 'https://api.freeagent.com/v2/contacts',
                qs: {per_page: per_page, page: '1', view: 'clients'},
                headers: {
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'OMS',
                    'Authorization': auth
                },
                resolveWithFullResponse: true
            };
            // do the request to get the number of pages
            rp(options)
                .then((response) => {
                    // console.log(response);
                    let links = response['headers']['link'];
                    if (links) {
                        links = links.split(';');
                        let starting_point = links[1].indexOf('?');
                        let ending_point = links[1].indexOf('&');
                        let pages = links[1].substring(starting_point+6, ending_point);
                        return pages;
                    }
                })
                .then(async (pages) => {
                    // now going to loop through the pages and push them into the temp table
                    for (i=1; i<=pages; i++) {
                        options['qs'] = {per_page: per_page, page: i, view: 'clients'};
                        let response = await rp(options);
                        clients = JSON.parse(response['body']);
                        clients = clients['contacts'];
                        for (client in clients) {
                            sqlQuery = `INSERT INTO temp_clients (url, organisation_name, status)
                                        OUTPUT INSERTED.url
                                        VALUES ('${clients[client]['url']}', '${clients[client]['organisation_name']}', '${clients[client]['status']}')`
                            let inserted = await s.tpQuery(sqlQuery)
                        }
                    }
                    let response = "*** *** FINISHED INSERTING *** ****";
                    return response;
                })
                .then(async (response) => {
                    sp = `ud_optimum_client`;
                    let updated = await s.tpSP(sp);
                    response = 'FINISHED UPDATING CLIENTS';
                    return response
                })
                .then((response) => {
                    req.flash('success', response);
                    res.redirect('/optimum/freeagent');
                })
                .catch((err) => {
                    req.flash('danger', "Error processing clients from freeagent");
                    res.redirect('/optimum/freeagent');
                })
        })
        .fail((err) => {
            req.flash('danger', err);
            res.redirect('/optimum/freeagent');
        })
}
exports.freeagentProjects = (req, res) => {
    let per_page = 25;
    const s = new sql.sqlServer();
    // get the tokens and clear temp_clients at the same time
    let sqlQuery = `SELECT * FROM freeagent;TRUNCATE TABLE temp_projects`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            let auth = "Bearer " + data[0]['access_token'];
            let options = {
                method: 'GET',
                url: 'https://api.freeagent.com/v2/projects',
                qs: {per_page: per_page, page: '1'},
                headers: {
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'OMS',
                    'Authorization': auth
                },
                resolveWithFullResponse: true
            };
            // do the request to get the number of pages
            rp(options)
                .then((response) => {
                    // console.log(response);
                    let links = response['headers']['link'];
                    console.log(links);
                    if (links) {
                        links = links.split(';');
                        let starting_point = links[1].indexOf('?');
                        let ending_point = links[1].indexOf('&');
                        let pages = links[1].substring(starting_point+6, ending_point);
                        console.log(pages);
                        return pages;
                    }
                })
                .then(async (pages) => {
                    // now going to loop through the pages and push them into the temp table
                    for (i=1; i<=pages; i++) {
                        console.log(i);
                        options['qs'] = {per_page: per_page, page: i};
                        let response = await rp(options);
                        projects = JSON.parse(response['body']);
                        projects = projects['projects'];
                        for (project in projects) {
                            sqlQuery = `INSERT INTO temp_projects (url, name, contact, status)
                                        OUTPUT INSERTED.url
                                        VALUES ('${projects[project]['url']}', '${projects[project]['name']}', '${projects[project]['contact']}', '${projects[project]['status']}')`
                            let inserted = await s.tpQuery(sqlQuery)
                        }
                    }
                    let response = "*** *** FINISHED INSERTING PROJECTS *** ****";
                    return response;
                })
                .then(async (response) => {
                    sp = `ud_optimum_project`;
                    let updated = await s.tpSP(sp);
                    response = 'FINISHED UPDATING PROJECTS';
                    return response
                })
                .then((response) => {
                    req.flash('success', response);
                    res.redirect('/optimum/freeagent');
                })
                .catch((err) => {
                    req.flash('danger', "Error processing projects from freeagent");
                    res.redirect('/optimum/freeagent');
                })
        })
        .fail((err) => {
            req.flash('danger', err);
            res.redirect('/optimum/freeagent');
        })
}
exports.freeagentTasks = (req, res) => {
    let per_page = 25;
    const s = new sql.sqlServer();
    // get the tokens and clear temp_clients at the same time
    let sqlQuery = `SELECT * FROM freeagent;TRUNCATE TABLE temp_tasks`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            let auth = "Bearer " + data[0]['access_token'];
            let options = {
                method: 'GET',
                url: 'https://api.freeagent.com/v2/tasks',
                qs: {per_page: per_page, page: '1'},
                headers: {
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'OMS',
                    'Authorization': auth
                },
                resolveWithFullResponse: true
            };
            // do the request to get the number of pages
            rp(options)
                .then((response) => {
                    // console.log(response);
                    let links = response['headers']['link'];
                    if (links) {
                        links = links.split(';');
                        let starting_point = links[1].indexOf('?');
                        let ending_point = links[1].indexOf('&');
                        let pages = links[1].substring(starting_point+6, ending_point);
                        return pages;
                    }
                })
                .then(async (pages) => {
                    // now going to loop through the pages and push them into the temp table
                    for (i=1; i<=pages; i++) {
                        options['qs'] = {per_page: per_page, page: i};
                        let response = await rp(options);
                        tasks = JSON.parse(response['body']);
                        tasks = tasks['tasks'];
                        for (task in tasks) {
                            sqlQuery = `INSERT INTO temp_tasks (url, project, name, is_billable, status)
                                        OUTPUT inserted.url
                                        VALUES ('${tasks[task]['url']}', '${tasks[task]['project']}', '${tasks[task]['name']}', '${tasks[task]['is_billable']}', '${tasks[task]['status']}')`
                            let inserted = await s.tpQuery(sqlQuery)
                        }
                    }
                    let response = "*** *** FINISHED INSERTING TASKS *** ****";
                    return response;
                })
                .then(async (response) => {
                    sp = `ud_optimum_task`;
                    let updated = await s.tpSP(sp);
                    response = 'FINISHED UPDATING TASKS';
                    return response
                })
                .then((response) => {
                    req.flash('success', response);
                    res.redirect('/optimum/freeagent');
                })
                .catch((err) => {
                    req.flash('danger', "Error processing projects from freeagent");
                    res.redirect('/optimum/freeagent');
                })
        })
        .fail((err) => {
            req.flash('danger', err);
            res.redirect('/optimum/freeagent');
        })
}
exports.freeagentUsers = (req, res) => {
    let per_page = 25;
    const s = new sql.sqlServer();
    // get the tokens and clear temp_clients at the same time
    let sqlQuery = `SELECT * FROM freeagent;TRUNCATE TABLE temp_users`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            let auth = "Bearer " + data[0]['access_token'];
            let options = {
                method: 'GET',
                url: 'https://api.freeagent.com/v2/users',
                qs: {per_page: per_page, page: '1'},
                headers: {
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'OMS',
                    'Authorization': auth
                },
                resolveWithFullResponse: true
            };
            // do the request to get the number of pages
            rp(options)
                .then((response) => {
                    let links = response['headers']['link'];
                    if (links) {
                        links = links.split(';');
                        let starting_point = links[1].indexOf('?');
                        let ending_point = links[1].indexOf('&');
                        let pages = links[1].substring(starting_point+6, ending_point);
                        return pages;
                    } else {
                        return 1;
                    }
                })
                .then(async (pages) => {
                    // now going to loop through the pages and push them into the temp table
                    for (i=1; i<=pages; i++) {
                        options['qs'] = {per_page: per_page, page: i};
                        let response = await rp(options);
                        users = JSON.parse(response['body']);
                        users = users['users'];
                        for (user in users) {
                            sqlQuery = `INSERT INTO temp_users (url, first_name, last_name, email, role)
                                        OUTPUT inserted.url
                                        VALUES ('${users[user]['url']}', '${users[user]['first_name']}', '${users[user]['last_name']}', '${users[user]['email']}', '${users[user]['role']}')`
                            let inserted = await s.tpQuery(sqlQuery)
                        }
                    }
                    let response = "*** *** FINISHED INSERTING USERS *** ****";
                    return response;
                })
                .then(async (response) => {
                    sp = `ud_optimum_user`;
                    let updated = await s.tpSP(sp);
                    response = 'FINISHED UPDATING USERS';
                    return response
                })
                .then((response) => {
                    req.flash('success', response);
                    res.redirect('/optimum/freeagent');
                })
                .catch((err) => {
                    req.flash('danger', "Error processing users from freeagent");
                    res.redirect('/optimum/freeagent');
                })
        })
        .fail((err) => {
            req.flash('danger', err);
            res.redirect('/optimum/freeagent');
        })
}
exports.freeagentExpenses = (req, res) => {
    let per_page = 100;
    const s = new sql.sqlServer();
    // get the tokens and clear temp_clients at the same time
    let sqlQuery = `SELECT * FROM freeagent;TRUNCATE TABLE temp_expenses`;
    s.tpQuery(sqlQuery)
        .then((data) => {
            let auth = "Bearer " + data[0]['access_token'];
            let options = {
                method: 'GET',
                url: 'https://api.freeagent.com/v2/expenses',
                qs: {per_page: per_page, page: '1'},
                headers: {
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'OMS',
                    'Authorization': auth
                },
                resolveWithFullResponse: true
            };
            // do the request to get the number of pages
            rp(options)
                .then((response) => {
                    let links = response['headers']['link'];
                    if (links) {
                        links = links.split(';');
                        let starting_point = links[1].indexOf('?');
                        let ending_point = links[1].indexOf('&');
                        let pages = links[1].substring(starting_point+6, ending_point);
                        return pages;
                    } else {
                        return 1;
                    }
                })
                .then(async (pages) => {
                    // now going to loop through the pages and push them into the temp table
                    let r_ps = [];
                    let q_ps = [];
                    for (i=1; i<=pages; i++) {
                        console.log(i);
                        options['qs'] = {per_page: per_page, page: i};
                        r_ps.push(rp(options));
                    }
                    Promise.all(r_ps)
                        .then((results) => {
                            for (result in results) {
                                expenses = JSON.parse(results[result]['body']);
                                expenses = expenses['expenses'];
                                for (expense in expenses) {
                                    sqlQuery = `INSERT INTO temp_expenses (category, currency, dated_on, description, gross_value, native_gross_value, native_sales_tax_value, project, rebill_type, rebilled_invoice, sales_tax_rate, sales_tax_value, url, [user])
                                                OUTPUT inserted.url
                                                VALUES ('${expenses[expense]['category']}', '${expenses[expense]['currency']}', '${expenses[expense]['dated_on']}',
                                                '${(expenses[expense]['description']).replace("'", "")}', ${(expenses[expense]['gross_value'] || 0)}, ${(expenses[expense]['native_gross_value'] || 0)},
                                                ${(expenses[expense]['native_sales_tax_value'] || 0)}, '${expenses[expense]['project']}', '${expenses[expense]['rebill_type']}',
                                                '${expenses[expense]['rebilled_invoice']}', ${(expenses[expense]['sales_tax_rate'] || 0)}, ${(expenses[expense]['sales_tax_value'] || 0)},
                                                '${expenses[expense]['url']}', '${expenses[expense]['user']}')`
                                    q_ps.push(s.tpQuery(sqlQuery));
                                }
                            }
                        })
                        .then((response) => {
                            console.log("going to process the query promisesn now");
                            Promise.all(q_ps)
                                .then((results) => {
                                    console.log(results);
                                })
                        })
                        .then(()=>{
                            let response = "*** *** FINISHED INSERTING EXPENSES *** ****";
                            return response;
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .then(async (response) => {
                    // sp = `ud_optimum_user`;
                    // let updated = await s.tpSP(sp);
                    response = 'FINISHED UPDATING EXPENSES';
                    return response
                })
                .then((response) => {
                    req.flash('success', response);
                    res.redirect('/optimum/freeagent');
                })
                .catch((err) => {
                    req.flash('danger', "Error processing expenses from freeagent");
                    res.redirect('/optimum/freeagent');
                })
        })
        .fail((err) => {
            req.flash('danger', err);
            res.redirect('/optimum/freeagent');
        })
}