var express = require("express");
const router = express.Router();
var app = express();
var config = require("./config.js");
//var cron = require("node-cron");
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
var jwt = require('jsonwebtoken');
var userAccountFunctions = require('./userAccount');
var challengeDataFunctions = require('./challengeData');
const multer = require('multer');
const path = require("path");


const secret = "temp"; //TODO: this changes to a config thing later
var allowedOrigins = ["https://trexa.me", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000", "http://127.0.0.1:3000"];



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.send(200);
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

//We're going to say that optional fields get a null value

app.get("/signup", function (req, res) {

    if (req && req.query && req.query.email) {
        var emailAddress = req.query.email;
        var name = req.query.name;
        var password = req.query.password;
        userAccountFunctions.checkIfUserExists(emailAddress).then(result => {
            if (result == true) {
                userAccountFunctions.getNewId().then(id => {
                    userAccountFunctions.createUserAccount(name, password, emailAddress, id);
                    res.send(true);
                })
            } else {
                res.send("emailInUse");
            }
        }
        )
    }
    else {
        res.send("oop");
    }
});

app.get("/checkResetLink", function (req, res) {
    if (req && req.query.string) {
        //user account function that doesn't exist yet - see if string is real and valid, return true or false
    }
})



app.get("/resetPassword", function (req, res) {
    if (req && req.query.email) {
        userAccountFunctions.generateResetPasswordLink(req.query.email).then(result => {
            if (result) {
                res.send(true);
            } else {
                res.send(false);
            }
        })
    }
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

app.get("/createChallenge", function (req, res) {
    var token = req.headers['authorization'];
    if(!token) return res.send("token error");

    jwt.verify(token, config.tokenSecret, function(err, decoded) {
        if (err) return res.send("token error");

        if (req && req.query.name && req.query.miles && req.query.id && decoded.id == req.query.id) {
            challengeDataFunctions.createNewChallenge(req.query.name, req.query.miles, req.query.id).then(response => {
                res.send(response);
            });
            res.send("success");
        } else {
            res.send("error");
        }   
        

    })


})


app.get("/getAllChallenges", function (req, res) {
    challengeDataFunctions.getAllChallenges().then(response => {
        res.send(response);
    })
})

app.get("/getUserChallenges", function (req, res) {

    userAccountFunctions.getUserChallenges(req.query.id).then(response => {
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

app.get("/getUserChallengeData", function (req, res) {

    if (req.query && req.query.user && req.query.challenge) {
        userAccountFunctions.getUserChallengeData(req.query.user, req.query.challenge).then(response => {
            res.send(response);
        })
    }
}
)

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



app.get("/login", function (req, res) {
    var origin = req.headers.origin;
    if (req.headers.origin && req.headers.origin != undefined) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    else { res.setHeader('Access-Control-Allow-Origin', 'https://trexa.me'); }

    res.setHeader("Content-Type", "text/plain");
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )

    var email, password

    if (req.query.email && req.query.password) {
        email = req.query.email;
        password = req.query.password;
    } else {
        res.send({ result: "invalidSubmission" });
        return;
    }

    userAccountFunctions.checkLogin(email, password).then(checkLoginResult => {
        if (checkLoginResult && checkLoginResult[0] && checkLoginResult[1]) {
            if (checkLoginResult[0] == true) {
                const payload = { username: checkLoginResult[1], id: checkLoginResult[2] };
                const token = jwt.sign(payload, config.tokenSecret, {
                    expiresIn: '14d'
                })
                res.cookie('token', token, { httpOnly: false }).send({ result: "validLogin" });
                return;
            } else {

                if (checkLoginResult[1] == 100) {
                    res.send({ result: "notFound" });
                    return;
                }

                if (checkLoginResult[1] == 150) {
                    res.send({ result: "badPassword" });
                    return;
                }
            }

        } else {
            res.send({ result: "error" });
        }
    }

    )



}
)

app.get("/verifytoken", function (req, res) {
    var origin = req.headers.origin;
    if (req.headers.origin && req.headers.origin != undefined) {
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else { res.setHeader('Access-Control-Allow-Origin', 'https://trexa.me'); }
    res.setHeader("Content-Type", "text/plain");

    var token = req.query.token;
    jwt.verify(token, config.tokenSecret, function (err, decoded) {
        if (err) {
            res.send("Invalid");
        } else {
            res.send("Valid");
        }
    });
})

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



app.listen(2222);