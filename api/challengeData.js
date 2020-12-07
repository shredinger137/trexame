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
  getNewId: getNewId,
  createNewChallenge: createNewChallenge,
  getChallengeData: getChallengeData,
}

async function createNewChallenge(challengeName, targetMiles, ownerId) {

    console.log("create called");

  getNewId().then(challengeId => {
    var data = {
      challengeName: challengeName,
      targetMiles: targetMiles,
      ownerId: ownerId,
      challengeId: challengeId
    }

    if (dbConnection) {
      dbConnection.collection("challenges").insertOne(data, function (err, result) {
        if (err) throw err;
        return true;
      }
      )
    }
  })
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


async function getChallengeData(challengeId) {

  if (dbConnection) {
    try {
      var challengeData = await dbConnection.collection("challenges").findOne({ challengeId: challengeId });
    } catch (err) {
      console.log(err);
      return false;
    }
    if (challengeData) {
      return challengeData;
    } else {
      return false;
    }

  } else {
    return false;
  }

}