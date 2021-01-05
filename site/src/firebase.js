var firebase = require('firebase')
const config = require('./config')

firebase.initializeApp(config.firebaseConfig)

const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()

module.exports = {
  firebase,
  provider,
  auth
}