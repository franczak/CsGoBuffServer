const express = require('express');
const session = require('express-session');
const steam = require('steam-login');

const app = express();

app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));
app.use(steam.middleware({
    realm: 'https://cs-go-buff-front.herokuapp.com/',
    verify: 'https://cs-go-buff-front.herokuapp.com//verify',
    apiKey: process.env.steamApiKey}
));

app.get('/', function(req, res) {
    res.send(req.user == null ? 'not logged in' : 'hello ' + req.user.username).end();
});

app.get('/authenticate', steam.authenticate(), function(req, res) {
    res.redirect('/');
});

app.get('/verify', steam.verify(), function(req, res) {
    res.send(req.user).end();
});

app.get('/logout', steam.enforceLogin('/'), function(req, res) {
    req.logout();
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);


