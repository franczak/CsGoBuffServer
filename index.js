const express = require('express');
const passport = require('passport');
const keys = require('./config/keys');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();

passport.use(new SteamStrategy({
        returnURL: 'http://localhost:5000/auth/steam/return',
        realm: 'http://localhost:3000',
        apiKey: keys.steamApiKey
    },
    function (identyfier, profile, done) {
        User.findByOpenID({openId: identyfier}, function (err, user) {
            return done(err, user)
        });
    }));

app.get('/auth/steam', passport.authenticate('steam'), function (req, res) {

});

app.get('auth/steam/return', passport.authenticate('steam', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    });