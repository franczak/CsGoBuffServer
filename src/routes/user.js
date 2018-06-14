const express = require('express')
const router = express.Router()
const db = require('../mongoDB').getDB

router.get('/', (req, res) => {
  res.send('default')
})

router.get('/friends', (req, res) => {
  const collection = db().collection("users");
  const user1 = {'name': 'Janusz'}
  collection.insertOne(user1, function (err, res){
    if(err) throw err;
    console.log("1 user added")
  })
})

router.get('/maps', (req, res) => {
  res.send('YOUR maps XD')
})

module.exports = router
