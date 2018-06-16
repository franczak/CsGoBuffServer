const express = require('express')
const router = express.Router()
const db = require('../mongoDB')

router.get('/', (req, res) => {
  res.send('default')
})

router.get('/friends', (req, res) => {
  res.send('YOUR friends XD')
})

router.get('/maps', (req, res) => {
  res.send('YOUR maps XD')
})


module.exports = router
