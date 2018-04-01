var express = require('express'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('./config'),
    Schema = mongoose.Schema,
    nodeMailerCode = require('./nodemailer-code'),
    cryptography = require('./../util/cryptography'),
    unAuthRoutes = express.Router();

var snakeModel = mongoose.model(config.modelname, new Schema(config.modelschema));
var snakeDB = snakeModel;



unAuthRoutes.post('/authenticateUser', function (req, res) {

    req.checkBody(config.emailSchema);
    req.checkBody(config.passwordSchema);

    req.getValidationResult()
        .then(function (result) {
            if(!result.isEmpty()){
                //returns array of error
                throw result.array();
            }
        })
        .then(function(){
            var data = req.body;
            return snakeDB.findOne({emailid: data.emailid, emailidvalidated: true, password: cryptography.encrypt(data.password)})
                .then(function (userFound) {
                    //user with this email exist
                    if (userFound) {
                        var profile = {
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),//Signing a token with 1 hour of expiration:
                            emailid: data.emailid,
                            displayname: userFound.displayname
                        };
                        res.status(config.successcode).json({ success: true, token: jwt.sign(profile, config.secret)});
                    }
                    else {
                        //user with this email does not exist
                        res.status(config.successcode).json({success: false, error:{msg:'User does not exist', param:'email'}});
                    }
                }, function (err) {
                    res.sendStatus(500);
                })
                .catch(function(error){
                    res.status(config.successcode).json(error);
                });
                /*.then(function(token){
                    /!*Do not see point is storing the token in DB*!/
                    res.status(config.successcode).json({ success: true, token: token});
                     /!*snakeDB.update({$push: {tokens: token}})
                        .then(function (data) {
                            if (data) {
                                res.status(config.successcode).json({ success: true, token: token});
                            }
                            else {
                                res.status(config.successcode).json({success: false});
                            }
                        }, function (err) {
                            //some error updating the password field
                            res.sendStatus(config.internalservererror);
                        });*!/
                })*/
        })
        .catch(function(result){
            res.status(config.successcode).json({ success: false});//, error: result
        });
});

unAuthRoutes.post('/adduser', function(req, res){

    req.checkBody(config.emailSchema);
    req.checkBody(config.passwordSchema);
    req.checkBody(config.nameSchema);
    var data = req.body;
    req.getValidationResult()
        .then(function (result) {
            if(!result.isEmpty()){
                throw result.array();
            }
        }, function(errResult){
            console.log(errResult);
        })
        .then(function () {
            return snakeDB.findOne({emailid: data.emailid});
        })
        .then(function (foundUser) {
            if(foundUser){
                //means user email id already exist
                res.status(config.successcode).json({success:false, userExist: true});
            }
            else {
                //user email id does not exist, register it
                var validationid = cryptography.randomValueHex(16);
                (new snakeModel({
                    displayname: data.displayname,
                    emailid: data.emailid,
                    password: cryptography.encrypt(data.password),
                    emailvalidationcode: validationid
                })).save()
                    .then(function(bSaved){
                        if(bSaved){
                            //after adding the user in db send email
                            nodeMailerCode.sendValidationMail(validationid, data)
                                .then(function(maildata){
                                    console.log('add user mail successful', maildata);
                                    res.status(config.successcode).json({success: true});
                                }, function (error) {
                                    console.log('add user mail failed', error);
                                    res.status(config.successcode).json({success: false, msg: 'verification mail sending failed'});
                                });
                        }
                        else{
                            res.status(config.successcode).json({success:false, msg: 'user not saved'});
                        }
                }, function(err){
                    res.status(config.internalservererror);
                });
            }
        }, function (err) {
            console.log('add user', err);
            res.sendStatus(config.internalservererror);
        })
        .catch(function(result){
            res.status(config.successcode).json({ success: false, msg: result.message});//, error: result
        });
});


//this route is for sending the default password to registered email address
unAuthRoutes.post('/resetPassword', function (req, res) {
    req.checkBody(config.emailSchema);

    req.getValidationResult()
        .then(function (result) {
            if(!result.isEmpty()){
                throw result.array();
            }
        })
        .then(function(){
            return snakeDB.findOne({emailid: req.body.emailid});
        })
        .then(function (userFound) {
            if (userFound) {
                var resetPwd = cryptography.randomValueHex(12);
                var encryptedPwd = cryptography.encrypt(resetPwd);
                nodeMailerCode.sendDefaultPassword(resetPwd, userFound)
                    .then(function(){
                        return userFound.update({password:encryptedPwd})
                            .then(function(updateSuccess){
                            if (updateSuccess) {
                                //password updated
                                res.status(config.successcode).json({success: true});
                            }
                            else {
                                res.status(config.successcode).json({success: false});
                            }
                        });
                    }, function (error) {
                        res.status(config.successcode).json({success: false});
                    });
            }
            else {
                //no user found, tell user its not found
                res.status(config.successcode).json({success: false});
            }
        }, function (err) {
            //some error finding the user
            res.sendStatus(config.internalservererror);
        })
        .catch(function(result){
            res.status(config.successcode).json({ success: false});
        });
});



//validate user email id
unAuthRoutes.get('/validate/:id/:emailid', function (req, res) {
    snakeDB.findOne({emailvalidationcode: req.params.id, emailid:req.params.emailid})
        .then(function(userFound) {
            if(userFound){
                return userFound.update({emailidvalidated: true});
            }
            else {
                return res.status(config.successcode).json({success: false});
            }
        }, function(error) {
            res.status(config.internalservererror).json({success: false});
        })
        .then(function (bUpdated) {
            if(bUpdated){
                res.status(config.successcode).json({success: true});
            }
        }, function (error) {
            res.status(config.internalservererror).json({success: false});
        })
        .catch(function (result) {
            res.status(config.successcode).json({ success: false});
        })
});

exports.unAuthRoutes = unAuthRoutes;