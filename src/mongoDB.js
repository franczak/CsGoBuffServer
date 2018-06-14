const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const MONGO_URL = process.env.database;

let _db;

MongoClient.connect(MONGO_URL, (err, db) => {
  if (err){
    return console.log(err);
  } else {
    _db = db
  }
});

module.exports = _db;