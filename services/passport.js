const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AzureStrategy = require('passport-azure-oauth2');
const LocalStrategy = require('passport-local');
const jwt = require('jwt-simple');
const keys = require('../config/keys');
const sql = require('../services/tedious');
const bcrypt = require('bcrypt');

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
            done({error: "User doesn't exist"}, null);
        } else {
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
        email = user.unique_name;
        const s = new sql.sqlServer();
        let sqlQuery = `SELECT * FROM solution_user WHERE email = '${email}'`
        s.tpQuery(sqlQuery).then((data) => {
            if (!data[0]) {
                done({error: "User doesn't exist"}, null);
            } else {
                let thisUser = data[0];
                sqlQuery = `UPDATE solution_user SET last_login = GETDATE() WHERE id = '${thisUser['id']}'`
                s.tpQuery(sqlQuery);
                done(null, thisUser);
            }
        })
    }));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
},
    function(req, username, password, done){
        const s = new sql.sqlServer();
        let sqlQuery = `SELECT * FROM solution_user WHERE email = '${req.body.email}'`;
        s.tpQuery(sqlQuery).then((user) => {
            let password_check = bcrypt.compareSync(req.body.password, user[0]['password_hash']);
            if (password_check) {
                done(null, user[0]);
                return;
            };
            return done(null, false);
        }).fail((err) => {
            return done(err, false);
        });
    }
))