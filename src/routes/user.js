const express = require('express')
const router = express.Router()
const db = require('../mongoDB').getDB
const helpers = require('./helpers')
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
  const userID = req.user.steamid
  const friendId = req.body.steamid

  helpers.checkIfPaysCS(friendId)
    .then(async _ => {
      const ids = await helpers.getFriends(userID)
      const user = await helpers.getUser(userID)
      if (!user.users.includes(friendId) && !ids.includes(friendId)) {
        await helpers.addUser(user, friendId)
      }
      res.sendStatus(200)
    })
    .catch(e => {
      console.log(e)
      res.sendStatus(404)
    })
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
