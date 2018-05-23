const express = require('express');
const session = require('express-session');
const steam = require('steam-login');
require('dotenv').config()
const cors = require('cors');
const axios = require('axios');
const app = express();
const server = 'https://cs-go-buff-front.herokuapp.com'
const client = 'https://cs-go-buff.herokuapp.com/auth/steam/callback'
app.use(cors({credentials: true, origin: client}));
app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));
app.use(steam.middleware({
    realm: server,
    verify: server + '/auth/steam/callback',
    apiKey: process.env.steamApiKey}
));




app.get('/', function(req, res) {
    req.user?
        res.redirect(client)
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
app.get('/details/:userId', steam.enforceLogin('/'), async (req, res) => {
    const resp = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=91ED890A9E13A8038F8D7E3DACACCFAA&steamids=${req.params.userId}`)
    res.send(resp.data);
})

app.get('/stats/:userId', steam.enforceLogin('/', async (req, res) => {
    const resp = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=91ED890A9E13A8038F8D7E3DACACCFAA&steamid=${req.params.userId}`)
    res.send(resp.data);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT);


