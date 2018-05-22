const express = require('express');
const session = require('express-session');
const steam = require('steam-login');
require('dotenv').config()
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'https://cs-go-buff-front.herokuapp.com'}));
app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));
app.use(steam.middleware({
    realm: 'https://cs-go-buff.herokuapp.com/',
    verify: 'https://cs-go-buff.herokuapp.com/auth/steam/callback',
    apiKey: process.env.steamApiKey}
));

app.get('/', function(req, res) {
    req.user?
        res.redirect('https://cs-go-buff-front.herokuapp.com')
        :
        res.redirect('/auth/steam');
});

app.get('/auth/steam', steam.authenticate(), function(req, res) {
    res.redirect('/');
});

app.get('/auth/steam/callback', steam.verify(), function(req, res) {
    res.redirect('/');
});

app.get('/user', function(req, res) {
    res.send(req.user);
});

app.get('/logout', steam.enforceLogin('/'), function(req, res) {
    req.logout();
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);


