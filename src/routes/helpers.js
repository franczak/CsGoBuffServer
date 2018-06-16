const axios = require('axios')
const db = require('../mongoDB').getDB

module.exports = {
  getFriends: async (id) => {
    const friends = await axios.get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.steamApiKey}&steamid=${id}&relationship=friend`)
    return friends.data.friendslist.friends.map(friend => friend.steamid)
  },
  checkIfPaysCS: async (id) => {
    try {
      await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env.steamApiKey}&steamid=${id}`)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  },
  getUser: async (userID) => {
    const collection = db().collection('users')
    try {
      let user = await collection.findOne({id: userID})
      if (user === null) {
        user = (await collection.insertOne({ id: userID, users: [] })).ops[0]
      }
      return user
    } catch (e) {
      console.log(e)
    }
  },
  addUser: async (user, friendId) => {
    const collection = db().collection('users')
    return collection.updateOne({_id: user._id}, {$set: {users: user.users.concat([friendId])}})
  }
}
