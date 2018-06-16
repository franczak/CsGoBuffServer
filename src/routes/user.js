const express = require('express')
const router = express.Router()
const db = require('../mongoDB').getDB
const axios = require('axios')
router.get('/', (req, res) => {
  res.send(req.user)
})

router.get('/friends', (req, res) => {
  /* const collection = db.collection('users')
  const user1 = {'name': 'Janusz'}
  collection.insert(user1);

  res.send('Added Janusz') */

})

router.post('/friend', async (req, res) => {
  const friends = await axios.get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.steamApiKey}&steamid=${req.user.steamid}&relationship=friend`)
  const friendId = req.body.steamid
  const ids = friends.data.friendslist.friends.map(friend => friend.steamid)
  const userID = req.user.steamid

  try {
    await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env.steamApiKey}&steamid=${friendId}`)
    if (!ids.includes(friendId)) {
      const collection = db().collection('users')
      try {
        const dbRes = await collection.findOne({id: userID}, {_id: 1, users: 1})
        if (!dbRes.users.includes(friendId)) {
          db.updateOne({_id: dbRes._id}, {$set: {users: dbRes.users.concat([friendId])}})
        }
      } catch (e) {
        await collection.insert({ id: userID, users: [friendId] })
      }
    }
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(404)
  }
})

router.get('/maps', (req, res) => {
  res.send('YOUR maps XD')
})

router.get('/add', (req, res) => {
  console.log('ADD')
  // const collection = db().collection("users");
  // const user1 = {'userid': req.userid}
  // collection.insertOne(user1, function (err, res){
  //   if(err) throw err;
  //   console.log("1 user added")
  // })
})

module.exports = router
