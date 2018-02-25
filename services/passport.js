const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AzureStrategy = require('passport-azure-oauth2');
const jwt = require('jwt-simple');
const keys = require('../config/keys');
const sql = require('../services/tedious');

passport.serializeUser((user, done) => {
    // console.log("serializeUser: ", user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM solution_user WHERE id = '${id}'`
    s.tpQuery(sqlQuery).then((data) => {
        user = data[0];
        // console.log("deserializeUser: ", user);
        done(null, user);
    })
});

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    proxy: true
}, (accessToken, refreshToken, profile, done) => {
    email = profile.emails[0]['value'];
    full_name = profile.displayName;
    const s = new sql.sqlServer();
    let sqlQuery = `SELECT * FROM solution_user WHERE email = '${email}'`
    s.tpQuery(sqlQuery).then((data) => {
        if (!data[0]) {
            console.log("the email doesn't exist in the database");
            done({error: "User doesn't exist"}, null);
        } else {
            console.log("the email exists in the database");
            let thisUser = data[0];
            sqlQuery = `UPDATE solution_user SET last_login = GETDATE() WHERE id = '${thisUser['id']}'`
            s.tpQuery(sqlQuery);
            done(null, thisUser);
        }
    })
    }));


passport.use(new AzureStrategy({
        clientID: keys.AZURE_CLIENT_ID,
        clientSecret: keys.AZURE_CLIENT_SECRET,
        callbackURL: '/auth/azure/callback',
        resource: keys.AZURE_RESOURCE,
        tenant: keys.AZURE_TENANT,
        prompt: 'login',
        state: false,
        proxy: true
    }, (accessToken, refreshToken, params, profile, done) => {
        const user = jwt.decode(params.id_token, "", true);
        console.log('user:', user);
        email = user.unique_name;
        const s = new sql.sqlServer();
        let sqlQuery = `SELECT * FROM solution_user WHERE email = '${email}'`
        s.tpQuery(sqlQuery).then((data) => {
            if (!data[0]) {
                console.log("the email doesn't exist in the database");
                done({error: "User doesn't exist"}, null);
            } else {
                console.log("the email exists in the database");
                let thisUser = data[0];
                sqlQuery = `UPDATE solution_user SET last_login = GETDATE() WHERE id = '${thisUser['id']}'`
                s.tpQuery(sqlQuery);
                done(null, thisUser);
            }
        })
    }));