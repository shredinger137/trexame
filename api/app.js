var express = require("express");
var app = express();
var config = require("./config.js");
var cron = require("node-cron");
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
var jwt = require('jsonwebtoken');
var userAccountFunctions = require('./userAccount');
var challengeDataFunctions = require('./challengeData');

const secret = "temp"; //TODO: this changes to a config thing later
var allowedOrigins = ["https://trexa.me", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000", "http://127.0.0.1:3000"];

app.use(function(req, res, next) {
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


cron.schedule("* * * * *", () => {
    //this will be used for syncing, stats generation
});


//*****************
//Express Routes
//*****************

//We're going to say that optional fields get a null value

app.get("/signup", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");

    if (req && req.query && req.query.email) {
        console.log("signing up " + req.query.name + ", " + req.query.email + ", " + req.query.password);
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

app.get("/createChallenge", function (req, res) {
    //TODO: This receives an Authorization header, but doesn't verify it

    if (req && req.query.name && req.query.miles && req.query.id) {
        challengeDataFunctions.createNewChallenge(req.query.name, req.query.miles, req.query.id).then(response => {
            res.send(response);
        });
        res.send("success");
    } else {
        res.send("err");
    }

})


app.get("/getUserChallenges", function (req, res) {

    var origin = req.headers.origin;
    if (req.headers.origin && req.headers.origin != undefined) {
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else { res.setHeader('Access-Control-Allow-Origin', 'https://trexa.me'); }

    userAccountFunctions.getUserChallenges(req.query.id).then(response => {
        res.send(response);
    })
})


app.get("/getUserChallengeData", function (req, res) {
    console.log("1");

    var origin = req.headers.origin;
    if (req.headers.origin && req.headers.origin != undefined) {
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else { res.setHeader('Access-Control-Allow-Origin', 'https://trexa.me'); }
    console.log(req.query);
    if (req.query && req.query.user && req.query.challenge) {
        userAccountFunctions.getUserChallengeData(req.query.user, req.query.challenge).then(response => {
            res.send(response);
        })
    }
}
)

app.get("/getChallengeData", function (req, res) {
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
    console.log("login");
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
            console.log(checkLoginResult);
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


//this should be gone; insead, use token verification on each API call, and just read the cookie for ID
//since this requires the token validation on the frontend it's not partciularly secure
//TODO

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


    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");

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