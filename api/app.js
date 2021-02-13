var express = require("express");
var app = express();
var config = require("./config.js");
//var cron = require("node-cron");
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
var userAccountFunctions = require('./userAccount');
var challengeDataFunctions = require('./challengeData');
const multer = require('multer');
const path = require("path");
app.use(express.json());

var admin = require('firebase-admin');

var serviceAccount = require("./credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var allowedOrigins = ["https://trexa.me", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000", "http://127.0.0.1:3000"];



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});



//Create a global holder for our database instance, then open the database and assign it here.
//Note that anywhere you use this, you need to have an if(dbConnection){} conditional so that the
//order will only attempt to run if the database connection exists. Later you might want to add a
//retry deal to it.

var dbConnection = null;
MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) { console.error(err) }
    dbConnection = client.db(config.globalDbName) // once connected, assign the connection to the global variable
    connectedToDatabase = true;
    console.log("Connected to database " + config.globalDbName);

    //things that happen on startup should happen here, after the database connects
})


//cron.schedule("* * * * *", () => {
//this will be used for syncing, stats generation
//});


//*****************
//Express Routes
//*****************

/* User Stuff */


app.post("/login/:id", function (req, res) {
    if (req.params.id && req.body && req.body.email && req.body.name && req.body.authorization) {

        //Here we're going to note that a login happened, and see if the account exists. If it doesn't, create it.
        //Either way we respond - existed or created - and the redirect can happen on the other end.     

        admin
            .auth()
            .verifyIdToken(req.body.authorization)
            .then((decodedToken) => {
                const uid = decodedToken.uid;
                console.log(uid);
                console.log(req.params.id)
                if (req.params.id == uid) {
                    userAccountFunctions.getUserData(uid).then(response => {
                        if (response) {
                            res.send(true)
                        } else {
                            //123 is a placeholder until we update the create function
                            userAccountFunctions.createUserAccount(req.body.name, '123', req.body.email, uid).then(response => {
                                //notice that we're not using the actual responses here; maybe worth doing?
                                res.send(true)
                            })
                        }
                    })
                } else {
                    console.log("token mismatch")
                }
            })
            .catch((error) => {
                // Handle error
            });
    }
})


app.post("/users", function (req, res) {
    if (req.body && req.body.email && req.body.name && req.body.userId) {
        userAccountFunctions.createUserAccount(req.body.name, "123", req.body.email, req.body.userId);
        res.send(true);
    }

    else {
        res.send("oop");
    }

});


app.get("/getUserChallenges", function (req, res) {

    userAccountFunctions.getUserChallenges(req.query.id).then(response => {
        res.send(response);
    })
})



app.get("/getUserChallengeData", function (req, res) {

    if (req.query && req.query.user && req.query.challenge) {
        userAccountFunctions.getUserChallengeData(req.query.user, req.query.challenge).then(response => {
            res.send(response);
        })
    }
}
)


app.get("/userdata", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");

    if (req && req.query && req.query.user) {
        var id = req.query.user;
        getUserData(id).then(result => {
            if (result) {
                res.send(result);
            } else {
                res.send("id_not_found");
            }
        })
    } else { res.send("Invalid query"); }
});


app.get("/updateprogress", function (req, res) {

    var id = req.query.user;
    var distance = req.query.distance;
    var date = req.query.date;
    var challenge = req.query.challenge;

    userAccountFunctions.updateUserProgress(id, distance, date, challenge).then(result => {
        res.send(result)
    });

});


async function getUserData(id) {
    if (dbConnection) {
        return await dbConnection.collection("users").findOne({ ID: id });
    }

}



/* Challenge Stuff */


app.post("/challenge", function (req, res) {

    admin
        .auth()
        .verifyIdToken(req.body.authorization)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            if (req.body.id == uid) {
                console.log("hit it");
                challengeDataFunctions.createNewChallenge(req.body.name, req.body.miles, req.body.id).then(response => {
                    res.send(response);
                });
            } else {
                console.log("token mismatch")
            }
        })
        .catch((error) => {
            // Handle error
        });
})



app.get("/enrollUserInChallenge", function (req, res) {
    if (req && req.query.challenge && req.query.user) {
        challengeDataFunctions.enrollUserInChallenge(req.query.challenge, req.query.user).then(result => {
            if (result) {
                res.send(true);
            } else {
                res.send(false);
            }
        })
    }
})



app.get("/submitNewAchievement", function (req, res) {
    if (req && req.query && req.query.challengeId) {
        challengeDataFunctions.addNewAchievement(req.query.challengeId, req.query).then(response => {
            res.send(response);
        })
    } else {
        res.send(false);
    }
}
)


app.get("/deleteAchievement", function (req, res) {
    if (req && req.query && req.query.achievementId && req.query.challengeId) {
        challengeDataFunctions.deleteAchievement(req.query.challengeId, req.query.achievementId).then(response => {
            res.send(response);
        })
    } else {
        res.send(false);
    }
}
)


app.post('/uploadImage', function (req, res) {

    var rand = Math.floor(Math.random() * 1000);
    var fileName;

    const storage = multer.diskStorage({
        destination: `${config.uploadDirectory}/${req.query.challengeId}`,
        filename: function (req, file, cb) {
            fileName = rand + file.originalname;
            cb(null, fileName);
        }
    });

    const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 },
    }).single("file");

    upload(req, res, err => {
        if (!err) return res.send(fileName).end();
    })
}
)



app.get("/getAllChallenges", function (req, res) {
    challengeDataFunctions.getAllChallenges().then(response => {
        res.send(response);
    })
})



app.get("/updateChallengeData", function (req, res) {
    if (req.query && req.query.challengeId) {
        //note: this is a little different than other things, in that we're sending the entire req.query
        challengeDataFunctions.updateChallengeData(req.query.challengeId, req.query).then(response => {
            if (response) {
                res.send(response);
            }
        })
    }
})



app.get("/getChallengeData", function (req, res) {
    console.log("challenge data");
    var origin = req.headers.origin;
    if (req.headers.origin && req.headers.origin != undefined) {
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else { res.setHeader('Access-Control-Allow-Origin', 'https://trexa.me'); }
    if (req.query && req.query.challengeId) {
        challengeDataFunctions.getChallengeData(req.query.challengeId).then(response => {
            res.send(response);
        })
    }
}
)




app.listen(2222);