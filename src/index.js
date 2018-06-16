const express = require('express')
const steam = require('steam-login')
require('dotenv').config()
const cors = require('cors')
const app = express()
const server = process.env.server
const client = process.env.client
const user = require('./routes/user')
const steamRouter = require('./routes/steam')
require('./mongoDB').connectDB(() => {}).then(() => {
  app.use(cors({credentials: true, origin: client}))
  app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }))
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
    res.redirect('/')
  })

  const PORT = process.env.PORT || 5000
  app.listen(PORT)
})
