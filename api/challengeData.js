var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
var config = require("./config.js");
var express = require("express");
var app = express();
var userAccountFunctions = require('./userAccount');
const { getUserData } = require('./userAccount');
const multer = require('multer');

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
    enrollUserInChallenge: enrollUserInChallenge,
    updateChallengeData: updateChallengeData,
    getAllChallenges: getAllChallenges,
    addNewAchievement: addNewAchievement,
    deleteAchievement: deleteAchievement
}


async function deleteAchievement(challengeId, achievementId){

    
    getChallengeData(challengeId).then(challengeData => {
        
        console.log("delete " + achievementId);

        if(challengeData.achievements){
            var count = 0;
            var achievements = challengeData.achievements
            
            for(var achievement of achievements){
                if(achievement.ident == achievementId){
                    achievements.splice(count, 1);
                    break;
                }
                count++;
            }

        } else {
            return false;
        }

       

        try {
            dbConnection.collection("challenges").updateOne({challengeId: challengeId}, {$set: {achievements: achievements}});
        }
        catch(err){
            console.log(err);
            return false;
        }
        finally {
            return true;
        }

        
    })
}

async function updateChallengeData(challengeId, updatedData){
    //we're assuming that the data passed contains only challengeId and updated data;
    //if this changes later, we'll have to remove any non-updating stuff from the request or
    //rethink how the request sends

    delete updatedData.challengeId;

    try {
        dbConnection.collection("challenges").updateOne({challengeId: challengeId}, {$set: updatedData}, {upsert: true})
    }
    catch(err) {
        throw err;
    }
    finally {
        return true;
    }
}

async function createNewChallenge(challengeName, targetMiles, ownerId, public) {

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

async function enrollUserInChallenge(challengeId, userId) {

    //TODO: Returns for errors should explain them

    if (dbConnection) {
        var challengeData = await getChallengeData(challengeId);
        var userData = await getUserData(userId);
        if (challengeData && userData) {
            if (userData) {
                if (challengeData["participants"]) {
                    var challengeParticipants = challengeData["participants"];
                    if (challengeParticipants.includes(userId)) {

                    } else {
                        challengeParticipants.push(userId);
                    }

                } else {
                    var challengeParticipants = [userId];
                }

                if (userData["enrolledChallenges"]) {
                    var userEnrolled = userData["enrolledChallenges"];
                    if (userEnrolled.includes(challengeId)) {

                    } else {
                        userEnrolled.push[challengeId];
                    }
                } else {
                    var userEnrolled = [challengeId];
                }

                try {
                    dbConnection.collection("users").updateOne({ trexaId: userId }, { $set: { enrolledChallenges: userEnrolled } });
                    dbConnection.collection("challenges").updateOne({ challengeId: challengeId }, { $set: { participants: challengeParticipants } })
                }
                catch (err) {
                    console.log(err);
                    return false;
                }
                finally {
                    return true;
                }
            }
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



async function addNewAchievement(challengeId, query){
    
    function compare(a, b){
        const distanceA = a.distance;
        const distanceB = b.distance;

        let comparison = 0;

        if (distanceA > distanceB){
            comparison = 1;
        } else {
            comparison = -1;
        }

        return comparison;
    }

    var id = Math.random().toString(36).slice(4);
    query['ident'] = id;

    getChallengeData(challengeId).then(challengeData => {
        delete query.challengeId;

        //again - we took the whole query, so we have to clean it up by removing other stuff
        //this should give us an object with all the relevant keys
        if(challengeData.achievements){
            var newAchievements = challengeData.achievements;
            newAchievements.push(query);
            newAchievements.sort(compare);

        } else {
            var newAchievements = [query];
        }
        try {
            dbConnection.collection("challenges").updateOne({challengeId: challengeId}, {$set: {achievements: newAchievements}}, {upsert: true});
        }
        catch (err) {
            throw err;
        }
        finally {
            return true;
        }
    })
}

async function getAllChallenges() {

    if (dbConnection) {
        try {
            var challengeData = await dbConnection.collection("challenges").find({}, {projection: {_id: 0, ownerId: 0, participants: 0}}).toArray();
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