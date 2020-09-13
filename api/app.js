var express = require("express");
var app = express();
var nodemailer = require("nodemailer");
var config = require("./config.js");
var cron = require("node-cron");
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
var emailFunctions = require('./emailFunctions');
const dbFunctions = require("./dbFunctions.js");
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');

const secret = "temp"; //TODO: this changes to a config thing later
var allowedOrigins = ["https://trexa.me", "https://locahost:3000", "https://localhost", "https://rrderby.org", "http://localhost:3000", "http://127.0.0.1:3000"];


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

    //generateStats();
    //createLeaderboardByTotalDistance();
    //createListOfCompleted();
})


cron.schedule("* * * * *", () => {
    generateStats();
    createLeaderboardByTotalDistance();
    createListOfCompleted();
});


//*****************
//Express Routes
//*****************

//We're going to say that optional fields get a null value;

app.get("/signup", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");

    if (req && req.query && req.query.email) {
        console.log("signing up " + req.query.name + ", " + req.query.email + ", " + req.query.password);
        var emailAddress = req.query.email;
        var name = req.query.name;
        var password = req.query.password;
        dbFunctions.checkIfUserExists(emailAddress).then(result => {
            if (result == true) {
                dbFunctions.getNewId().then(id => {
                    dbFunctions.createUserAccount(name, password, emailAddress, id);
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

    var origin = req.headers.origin;
    if (req.headers.origin && req.headers.origin != undefined) {
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else { res.setHeader('Access-Control-Allow-Origin', 'https://trexa.me'); }
    res.setHeader("Content-Type", "text/plain");
    if (req && req.query.name && req.query.miles && req.query.id) {
        dbFunctions.createNewChallenge(req.query.name, req.query.miles, req.query.id).then(response => {
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

    dbFunctions.getUserChallenges(req.query.id).then(response => {
        res.send(response);
    })
})


app.get("/getUserChallengeData", function (req, res) {
    var origin = req.headers.origin;
    if (req.headers.origin && req.headers.origin != undefined) {
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else { res.setHeader('Access-Control-Allow-Origin', 'https://trexa.me'); }

    if (req.query && req.query.challenge) {
        dbFunctions.getUserChallengeData(req.query.challenge).then(response => {
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

    dbFunctions.checkLogin(email, password).then(checkLoginResult => {
        if (checkLoginResult && checkLoginResult[0] && checkLoginResult[1]) {
            console.log(checkLoginResult);
            if (checkLoginResult[0] == true) {
                const payload = { username: checkLoginResult[1], id: checkLoginResult[2] };
                const token = jwt.sign(payload, secret, {
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
    jwt.verify(token, secret, function (err, decoded) {
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

app.get("/getallusers", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");
    getAllUserData().then(result => {
        if (result) {
            res.send(result);
        } else {
            res.send("err");
        }
    })

});



app.get("/updatemarathon", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");

    if (req && req.query && req.query.user && req.query.marathon) {
        var id = req.query.user;
        var marathon = req.query.marathon;
        if (dbConnection) {
            dbConnection.collection("users").updateOne({ ID: id }, { $set: { marathon: marathon } }, function (err, result) {
                if (err) throw err;
                else {
                    res.send("200");
                }
            }
            );
        }

    } else { res.send("Invalid query"); }
});

app.get("/getstats", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");
    getStats().then(result => {
        res.send(result);
    })

});

app.get("/updatePublicOption", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");

    var id = req.query.user;
    var value = req.query.value;
    if (dbConnection) {
        dbConnection.collection("users").updateOne({ ID: id }, { $set: { allowPublic: value } }, { upsert: true }, function (err, result) {
            if (err) throw err;
            else {
                res.send("200");
            }
        }
        );
    } else {
        console.log("err, db not connected in updatePublicOption")
    }
});

app.get("/updateprogress", function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");

    var progressData;
    var id = req.query.user;
    var distance = req.query.distance;
    var date = req.query.date;
    getUserData(id)
        .then(data => {
            progressData = data.progress;
            progressData[date] = distance;
            if (distance == 0) {
                delete progressData[date];
            }

            if (dbConnection) {
                dbConnection.collection("users").updateOne({ ID: id }, { $set: { progress: progressData } }, function (err, result) {
                    if (err) throw err;
                    else {
                        res.send("200");
                    }
                }
                );
            }
        })
});

function updateUserTotal(id, total) {
    if (dbConnection) {

        dbConnection.collection("users").updateOne({ ID: id }, { $set: { totalDistance: total } }, { upsert: true }, function (err, result) {
            if (err) throw err;
        }
        );
    }
}


async function createLeaderboardByTotalDistance() {

    if (dbConnection) {

        var allUsers = await dbConnection.collection("users").find({ allowPublic: "true" }, { projection: { _id: 0, name: 1, totalDistance: 1 } }).limit(50).sort({ totalDistance: -1 }).toArray();

        dbConnection.collection("stats").updateOne({ name: "combinedStats" }, { $set: { leaderBoardByDistance: allUsers } }, { upsert: true }, function (err, result) {
            if (err) throw err;
            else {
                console.log("wrote stats in createLeaderboardByTotalDistance");
            }

        }
        );
    } else { console.log("Database unavailable in createLeaderboardByTotalDistance"); }

}

async function createListOfCompleted() {

    if (dbConnection) {

        var completedUsers = await dbConnection.collection("users").find({ allowPublic: "true", totalDistance: { $gte: 155 } }, { projection: { _id: 0, name: 1, totalDistance: 1 } }).toArray();

        dbConnection.collection("stats").updateOne({ name: "completedFull" }, { $set: { completedFullMarathon: completedUsers } }, { upsert: true }, function (err, result) {
            if (err) throw err;
            else {
                console.log("wrote stats in createListOfCompleted");
            }

        }
        );
    } else { console.log("Database unavailable in createListOfCompleted"); }

}



//We're going to want to come back to this. TODO
function cleanProgressEntries() {
    getAllUserData().then(result => {
        for (var users in result) {
            for (var date in users.progress) {

            }
        }
    })
}

function generateStats() {
    getAllUserData().then(result => {
        var totalMiles = 0;
        var userCount = 0;
        var distanceByDate = {};
        if (result) {
            //get total miles for all added together. Also update individual totals.
            for (user of result) {
                userCount += 1;
                if (user.progress) {
                    var userTotal = 0;
                    for (date in user.progress) {
                        var milesForDate = parseFloat(user.progress[date].replace(/[a-z]|[A-Z]|\s/, ""));
                        if (typeof milesForDate == "number" && isNaN(milesForDate) == false) {
                            userTotal += milesForDate;
                            totalMiles += milesForDate;
                            if (distanceByDate[date]) {
                                distanceByDate[date] += milesForDate;
                            } else {
                                distanceByDate[date] = milesForDate;
                            }
                        }
                        console.log(user.name + " " + (Math.floor(userTotal * 100)) / 100)
                        updateUserTotal(user.ID, (Math.floor(userTotal * 100)) / 100);
                    }
                };
            }
            console.log("wrote stats in generateStats");
            if (dbConnection) {

                totalMiles = Math.floor(totalMiles * 1000) / 1000;

                dbConnection.collection("stats").updateOne(
                    { name: "combinedStats" },
                    { $set: { combinedMiles: totalMiles, totalUsers: userCount, distanceByDate: distanceByDate } },
                    { upsert: true },
                    function (err, result) {
                        if (err) throw err;
                    }
                );
            }

        } else {
            console.log("err, no result in generateStats (has db connected yet?)");
        }
    })

}


async function getUserData(id) {
    if (dbConnection) {
        return await dbConnection.collection("users").findOne({ ID: id });
    }

}


async function getAllUserData(query) {
    if (dbConnection) {
        return await dbConnection.collection("users").find(query).toArray();
    }
}



function createWelcomeEmail(id) {
    var content = `<p>Welcome to the Skate the Bay Marathon!</p>
                    <br /><br />
                    <p>Thank you for signing up for Resurrection Roller Derby's Skate the Bay Virtual Marathon. Your unique dashboard link is: <a href="https://marathon.rrderby.org/dashboard?id=${id}">https://marathon.rrderby.org/dashboard?id=${id}</a>. Use this link to view
                    and update your progress. Be sure to join our Facebook group and tag your photos/Tweets with #SkateTheBay to stay in touch with other skaters. </p>
                    <br />
                    <p>We're encouraging all participants to also get in contact with their local food banks to make donations. They are providing unprecedented support to our community, and we hope the roller derby and skating communities can help then succeed.</p>
        `
    return content;
}


//TODO: Maybe todo. This doesn't check ID, but it's random enough that I'd be surprised if this became an issue.
async function checkUserData(id, userEmail) {
    if (dbConnection) {
        var results = await dbConnection.collection("users").find({ email: userEmail }).toArray();
        if (results.length > 0) {
            return false;
        } else { return true; }
    }
}


async function getStats() {
    if (dbConnection) {
        var results = await dbConnection.collection("stats").find({}).toArray();
        if (results.length > 0) {
            return results;
        } else { return false; }
    }
}



app.listen(2222);