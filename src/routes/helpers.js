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
  },
  getDbFriends: async (id) => {
    const collection = db().collection('users')
    let user = await collection.findOne({id})
    if (user === null) {
      return []
    }
    return user.users
  },
  getUserFavouriteMap: async (id) =>{
    const neededStats = [
      'total_kills',
      'total_deaths',
      'total_kills_headshot',
      'total_shots_hit',
      'total_shots_fired',
      'total_matches_won',
      'total_matches_played',
      'total_wins_map_de_cbble',
      'total_wins_map_de_dust2',
      'total_wins_map_de_dust',
      'total_wins_map_de_inferno',
      'total_wins_map_de_nuke',
      'total_wins_map_de_train',
      'total_kills_ssg08',
      'total_kills_mp7',
      'total_kills_m4a1',
      'total_kills_p90',
      'total_kills_awp',
      'total_kills_ak47',
    ];

    try {
      let playerDetails = {data:{maps:{}}};
      const resp = await axios.get(`http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env.steamApiKey}&steamid=${id}`)
      const playerStats = resp.data.playerstats.stats
        .filter(({name}) => neededStats.includes(name))
        .reduce((prev, nexObj) => {
          return{
            ...prev,
            [nexObj.name]: nexObj.value,
          }
        }, {});
      playerDetails.data.kd = (playerStats['total_kills']/playerStats['total_deaths']).toFixed(2);
      playerDetails.data.hs = Math.round((playerStats['total_kills_headshot']/playerStats['total_shots_hit'])*100)
      playerDetails.data.accuracy = Math.round((playerStats['total_shots_hit']/playerStats['total_shots_fired'])*100)
      playerDetails.data.winRatio = Math.round((playerStats['total_matches_won']/playerStats['total_matches_played'])*100)
      playerDetails.data.totalKills = playerStats['total_kills'];
      playerDetails.data.cbble = playerStats['total_wins_map_de_cbble'];
      playerDetails.data.dust2 = playerStats['total_wins_map_de_dust2'];
      playerDetails.data.dust = playerStats['total_wins_map_de_dust'];
      playerDetails.data.inferno = playerStats['total_wins_map_de_inferno'];
      playerDetails.data.nuke = playerStats['total_wins_map_de_nuke'];
      playerDetails.data.train = playerStats['total_wins_map_de_train'];
      playerDetails.data.ssg08 = playerStats['total_kills_ssg08'];
      playerDetails.data.mp7 = playerStats['total_kills_mp7'];
      playerDetails.data.m4a1 = playerStats['total_kills_m4a1'];
      playerDetails.data.p90 = playerStats['total_kills_p90'];
      playerDetails.data.ak47 = playerStats['total_kills_ak47'];
      playerDetails.data.awp = playerStats['total_kills_awp'];
      return playerDetails;


    }catch (e) {
      console.log(e)
    }
  }
}
