const express = require('express');
const router = express.Router();
const sql = require('../../services/tedious');
const User = require('../../model/User');

router.get('/tedious', (req, res) => {
    const s = new sql.sqlServer();
    let sqlQuery = "SELECT * FROM solution_user;";
    s.tpQuery(sqlQuery).then((data) =>{
        res.json(data);
    })
});

router.get('/test', (req, res) => {
    // const andrew = {name: 'Andrew', age: 100};
    // res.json(andrew);
    res.send(req.query);
})

router.get('/reverse/:name', (req, res) => {
    const reverse = [...req.params.name].reverse().join('');;
    res.send(reverse);
})

router.get('/render', (req, res) => {
    console.log(user);
    res.render('hello', {
        title: 'Render Template',
        name: 'Andrew',
        dog: 'Rory'
    });
})

router.get('/user/:email', async (req, res) => {
    const new_user = await new User();
    await new_user.initEmail(req.params.email);
    res.json(new_user);
})

module.exports = router;
