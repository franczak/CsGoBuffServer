const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const db = require('../mongoDB').getDB
=======
const db = require('../mongoDB')
>>>>>>> 1aa21ae8866483412f8e203fb1d6b5cc4a4029e1

router.get('/', (req, res) => {
  res.send('default')
})

router.get('/friends', (req, res) => {
<<<<<<< HEAD
  res.send('YOUR friends XD')
=======
  const collection = db.collection('users')
  const user1 = {'name': 'Janusz'}
  collection.insert(user1);

  res.send('Added Janusz')
>>>>>>> 1aa21ae8866483412f8e203fb1d6b5cc4a4029e1
})

router.get('/maps', (req, res) => {
  res.send('YOUR maps XD')
})

router.get('/add', (req,res) =>{
  console.log("ADD")
  // const collection = db().collection("users");
  // const user1 = {'userid': req.userid}
  // collection.insertOne(user1, function (err, res){
  //   if(err) throw err;
  //   console.log("1 user added")
  // })
})

module.exports = router
