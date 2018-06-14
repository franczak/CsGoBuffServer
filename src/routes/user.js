const express = require('express');
const router = express.Router();
const db = require('../_db');

router.get('/', (req, res) => {
  res.send('default')
})

router.get('/friends', (req, res) => {
  const collection = db.collection('users');
  const user1= {'name': 'Janusz'};
  collection.insert(user1);y

  res.send('Added Janusz');
});


router.get('/maps', (req, res) => {
  res.send('YOUR maps XD')
});


module.exports = router;