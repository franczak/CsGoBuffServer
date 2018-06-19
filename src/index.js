const express = require('express')
const steam = require('steam-login')
require('dotenv').config()
const cors = require('cors')
const app = express()
const server = process.env.server
const client = process.env.client
const user = require('./routes/user')
const steamRouter = require('./routes/steam')
var bodyParser = require('body-parser')


require('./mongoDB').connectDB(() => {}).then(() => {
  app.use(cors({credentials: true, origin: client}))
  app.use(bodyParser.json())
  app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }))
  if(process.env.enviroment=='prod') {
    app.use(steam.middleware({
      realm: server,
      verify: server + '/auth/steam/callback',
      apiKey: process.env.steamApiKey}
    ))

    app.use('/user', steam.enforceLogin('/'), user)
    app.use('/steam', steam.enforceLogin('/'), steamRouter)

    app.get('/', function (req, res) {
      req.user
        ? res.redirect(client)
        : res.redirect('/auth/steam')
    })

    app.get('/auth/steam', steam.authenticate(), function (req, res) {
      res.redirect('/')
    })

    app.get('/auth/steam/callback', steam.verify(), function (req, res) {
      res.redirect('/')
    })

    app.get('/logout', steam.enforceLogin('/'), function (req, res) {
      req.logout()
      res.sendStatus(200)
    })
  } else {
    app.use((req, res, next) => {
      req.user = userMock
      next();
    })
    app.use('/user', user)
    app.use('/steam', steamRouter)
  }


  const PORT = process.env.PORT || 5000
  app.listen(PORT)
})



const userMock = {
  "_json": {
    "steamid": "76561198076041685",
    "communityvisibilitystate": 3,
    "profilestate": 1,
    "personaname": "ign699",
    "lastlogoff": 1353524380,
    "profileurl": "https://steamcommunity.com/profiles/76561198076041685/",
    "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    "avatarmedium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    "avatarfull": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    "personastate": 0,
    "primaryclanid": "103582791429521408",
    "timecreated": 1353252719,
    "personastateflags": 0
  },
  "steamid": "76561198076041685",
  "username": "ign699",
  "profile": "https://steamcommunity.com/profiles/76561198076041685/",
  "avatar": {
    "small": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    "medium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    "large": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"
  }
}


