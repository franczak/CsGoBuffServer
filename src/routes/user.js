const express = require('express')
const router = express.Router()
const db = require('../mongoDB').getDB

router.get('/', (req, res) => {
  res.send('default')
})

router.get('/friends', (req, res) => {
  res.send('YOUR friends XD')
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
