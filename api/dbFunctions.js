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
    console.log("in createuseraccount, password " + password);

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
  getNewId: getNewId
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
      var account = await dbConnection("users").findOne({ id: id });
    } catch (err) {
      console.log(err);
      return false;
    }
    if (account) {
      getNewId();
    } else {
      return id;
    }
  }
}