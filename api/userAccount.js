var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
var config = require("./config.js");
var express = require("express");
var app = express();
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

var dbConnection = null;
MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
  if (err) { console.error(err) }
  dbConnection = client.db(config.globalDbName) // once connected, assign the connection to the global variable
  connectedToDatabase = true;
  console.log("Connected to database " + config.globalDbName);

})



module.exports = {
  updateUserTotal: function (id, total, marathonID) {
    if (dbConnection) {

      dbConnection.collection("users").updateOne({ ID: id }, { $set: { totalDistance: total } }, { upsert: true }, function (err, result) {
        if (err) throw err;
      }
      );
    }

  },

  createUserAccount: async function (username, password, emailAddress, id, res) {
    var passwordHashed = passwordHash.generate(password);

    var userData = {
      trexaId: id,
      username: username,
      email: emailAddress,
      password: passwordHashed
    }

    if (dbConnection) {
      dbConnection.collection("users").insertOne(userData, function (err, result) {
        if (err) throw err;
        return true;
      }
      )
    }
  },

  checkLogin: checkLogin,
  checkIfUserExists: checkIfUserExists,
  getNewId: getNewId,
  getUserChallenges: getUserChallenges,
  getUserData: getUserData,
  getUserChallengeData: getUserChallengeData,
  updateUserProgress: updateUserProgress,
  verifyToken:verifyToken
}


async function verifyToken(token){
  console.log(token);
    if (!token){
        return false;
    }
    jwt.verify(token, config.tokenSecret, function(err, decoded){
        if(err)
        return false;

        //not totally sure if 'true' means it's actually verified or not
        console.log(true);
        return true;
    })
}

async function checkLogin(email, password) {
  if (dbConnection) {
    try {
      var account = await dbConnection.collection("users").findOne({ email: email });
    } catch (err) {
      console.log(err);
      return [false, err];
    }
    if (account == null) {
      return [false, 100];
    }
    if (account) {
      if (passwordHash.verify(password, account["password"])) {
        return [true, account.username, account.trexaId];
      } else {
        return [false, 150];
      }

    }
  }
}

async function updateUserProgress(id, distance, date, challenge) {
  if (id && distance && date && challenge) {
    distance = Number(distance);
    getUserData(id).then(userData => {
      console.log("get");
      console.log(userData);
      if (userData.progress) {
        //user's 'progress' entry exists
        var userProgress = userData.progress;

        if (userProgress[challenge]) {
          //user has progress entered for the current challenge
          var challengeProgress = userProgress[challenge];
          challengeProgress[date] = distance;
          if (distance == 0) {
            delete challengeProgress[date]
          }
          userProgress[challenge] = challengeProgress;
          //userProgress is now prepped to be written to the database

        } else {
          //user progress exists, but entry for this challenge does not
          userProgress[challenge] = {};
          userProgress[challenge][date] = distance;

        }

      } else {
        console.log("else");
        var userProgress = {};
        userProgress[challenge] = {};
        userProgress[challenge][date] = distance;
      }

      if (dbConnection) {

        dbConnection.collection("users").updateOne({ trexaId: id }, { $set: { progress: userProgress } }, function (err, result) {
          if (err) throw err;
          return true;
        }
        )
      } else {
        return false;
      }

    })
  }
}

async function getUserChallengeData(userID, challengeID) {
  if (dbConnection) {
    try {
      var account = await dbConnection.collection("users").findOne({ trexaId: userID });
    } catch (err) {
      console.log(err);
      return false;
    }
    if (account == null) {
      return false;
    }
    if (account && account["progress"]&& account["progress"][challengeID]) {
      return account["progress"][challengeID];
    } else {
      return false;
    }
  }
}



async function checkIfUserExists(email) {
  if (dbConnection) {
    try {
      var account = await dbConnection.collection("users").findOne({ email: email });
    } catch (err) {
      console.log(err);
    }
    if (account) {
      return false;
    }
    else {
      return true;
    }
  }
}

async function getNewId() {
  var id = Math.random().toString(36).slice(2);
  if (dbConnection) {
    try {
      var account = await dbConnection.collection("users").findOne({ trexaId: id });
    } catch (err) {
      console.log(err);
      return false;
    }
    if (account) {
      getNewId();
    } else {
      try {
        var challenge = await dbConnection.collection("challenges").findOne({ challengeId: id });
      } catch (err) {
        console.log(err);
        return false;
      }
      if (challenge) {
        getNewId();
      } else {
        return id;
      }
    }
  }
}


//TODO: Refactor this in proper try/catch/finally format

async function getUserChallenges(id) {
  //TODO: return empty array in case where there's no value
  var allChallenges = {};

  if (dbConnection) {
    try {
      var userOwnedChallenges = await dbConnection.collection("challenges").find({ ownerId: id }).toArray();
      var userJoinedChallenges = await dbConnection.collection("challenges").find({ participants: { $in: [id] } }).toArray();
      var userOtherChallenges = await dbConnection.collection("challenges").find({ ownerId: {$ne: id}, participants: { $nin: [id] }}).toArray();

    } catch (err) {
      console.log(err);
      return false;
    }

    finally {
      if(userOwnedChallenges){
        allChallenges["owned"] = userOwnedChallenges;
      } else {
        allChallenges["owned"] = [];
      }

      if(userJoinedChallenges){
        allChallenges["joined"] = userJoinedChallenges;
      } else {
        allChallenges["joined"] = [];
      }

      if(userOtherChallenges){
        allChallenges["notEnrolled"] = userOtherChallenges;
      } else {
        allChallenges["notEnrolled"] = [];
      }

      console.log(userOtherChallenges);

      return allChallenges;

    }

  }
}

//TODO: Probably not wise to get all user data every time but whatever. This is alpha. Maybe later we can prep this data before sending it.
async function getUserData(userId) {
  if (dbConnection) {
    try {
      var userData = await dbConnection.collection("users").findOne({ trexaId: userId });
    } catch (err) {
      console.log(err);
      return false;
    }
    if (userData) {
      return userData;
    } else {
      return false;
    }

  } else {
    return false;
  }

}
