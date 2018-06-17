const express = require('express')
const router = express.Router()
const axios = require('axios')
const helpers = require('./helpers')

router.get('/details/:userId', async (req, res) => {
  try {
    const resp = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.steamApiKey}&steamids=${req.params.userId}`)
    res.send(resp.data)
  } catch (e) {
    res.sendStatus(404)
  }
})

router.get('/stats/:userId', async (req, res) => {
  try {
    const resp = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env.steamApiKey}&steamid=${req.params.userId}`)
    res.send(resp.data)
  } catch (e) {
    res.sendStatus(404)
  }
})

router.get('/favourites/:userId', async (req,res)=>{
  try {
    res.send(await helpers.getUserFavouriteMap(req.params.userId));
  } catch (e) {
    res.sendStatus(404)
  }
})

router.get('/friends', async (req, res) => {
  const resp = await axios.get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.steamApiKey}&steamid=${req.user.steamid}&relationship=friend`)
  res.send(resp.data.friendslist.friends)
})

module.exports = router
