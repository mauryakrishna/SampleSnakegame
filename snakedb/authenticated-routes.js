var express = require('express'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('./config'),
    cryptography = require('./../util/cryptography'),
    routes = express.Router();

var snakeDB = mongoose.model(config.modelname);

function getToken(bearerToken) {
    return bearerToken ? bearerToken.replace('Bearer ', ''): null;
}

routes.use(function (req, res, next) {
    var token = getToken(req.headers.authorization);
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log('verification failed');
                return res.status(config.successcode).json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;

                //find user with this auth token to validate
                snakeDB.findOne({emailid: req.decoded.emailid, tokens: {$in: [token]}})
                    .then(function (userFound) {
                        next();
                    }, function (err) {
                        res.status(config.sessionexpired).json({success: false, message: 'Invalid token.'});
                    });
            }
        });
    }
    else {
        res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

//the logout mechanism has to be revisited, this is not valid in case of abruptly closing the browser window
routes.post('/logOut', function (req, res) {
    var token = getToken(req.headers.authorization);
    snakeDB.update({emailid: req.decoded.emailid}, {$pull: {tokens: token}})
        .then(function (data) {
            if (!data) {
                console.log('Logout no user found');
            }
            res.status(config.successcode).json({success: true, message: 'User logged out successfully.'})
        }, function (err) {
            console.log('Error logout: ', err);
            res.sendStatus(config.internalservererror);
        })
});

routes.post('/saveScore', function (req, res) {
    snakeDB.findOne({emailid: req.decoded.emailid})
        .then(function (userFound) {
            //userfound -> update -> sort by score -> count if more then 10 -> remove extra
            if (userFound) {
                userFound.update({
                    $push: {
                        scores: {
                            $each: [{score: req.body.score}],
                            $sort: {score: -1},
                            $slice: 10//it restrict the array length to 10 starting from top, give negative value for last 10 from end
                        }
                    }
                })
                .then(function (data) {
                    if (data) {
                        res.status(config.successcode).json({success: true});
                        console.log('score inserted');
                    }
                    else {
                        res.status(config.successcode).json({success: false});
                        console.log('score inserted failed');
                    }
                }, function (errScoreAdding) {
                    res.sendStatus(config.internalservererror);
                    console.log('Error saving score', errScoreAdding);
                });
            }
            else {
                //user does not exist
                res.status(config.successcode).json({success: false});
            }
        }, function (err) {
            //error saving score
            res.sendStatus(config.internalservererror);
        });
});

routes.post('/getScore', function (req, res) {
    var bAllPlayer = req.body.allPlayer;

    //bAllPlayer:true means get top 10 from all users, false means get score for that particular user
    if (bAllPlayer) {
        snakeDB.aggregate(
            {$unwind: '$scores'},
            {$sort: {'scores.score': -1}},
            {"$limit": 10},//top 10 values fro all players
            {
                $project: {displayname: "$displayname", emailid: '$emailid', score: '$scores'}
            })
            .then(function (data) {
                res.status(config.successcode).json({scores: data});
            }, function (err) {
                res.status(config.successcode).json({scores: null});
            });
    }
    else {
        //if getting score for particular user
        snakeDB.findOne({emailid: req.decoded.emailid})
            .then(function (userFound) {
                if (userFound) {
                    //send all score to client and perform sorting there to save on server performance
                    res.status(config.successcode).json({scores: userFound.scores});
                }
                else {
                    res.status(config.successcode).json({scores: null});
                }
            }, function (err) {
                res.sendStatus(config.internalservererror);
            });
    }
});

//this route is for updating
routes.post('/changePassword', function (req, res) {
    req.checkBody(config.passwordSchema);

    req.getValidationResult()
        .then(function (result) {
            if(!result.isEmpty()){
                throw result.array();
            }
        })
        .then(function(){
            return snakeDB.findOne({emailid: req.decoded.emailid, password: cryptography.encrypt(req.body.password)});
        })
        .then(function (userFound) {
            if (userFound) {
                userFound.update({password: cryptography.encrypt(req.body.newpassword)})
                    .then(function (data) {
                        if (data) {
                            //password updated
                            res.status(config.successcode).json({success: true});
                        }
                        else {
                            res.status(config.successcode).json({success: false});
                        }
                    }, function (err) {
                        //some error updating the password field
                        res.sendStatus(config.internalservererror);
                    });
            }
            else {
                res.status(config.successcode).json({ success: false});
            }
        }, function (err) {
            res.sendStatus(500);
        })
        .catch(function(result){
            res.status(config.successcode).json({ success: false});
        });
});

exports.authRoutes = routes;