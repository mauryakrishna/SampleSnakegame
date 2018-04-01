var nodemailer = require("nodemailer");
var ses = require('nodemailer-ses-transport');

/*for setting up Amazon SES service for email sending for various need*/
var smtpTransport = nodemailer.createTransport(ses({
    accessKeyId: 'FromAmazon',
    secretAccessKey: 'FromAmazon',
    region: 'us-west-2'
}));

//http://budiirawan.com/send-emails-using-amazon-ses-and-node-js/
var supportMail = 'support@yourdomain.in',
    noreplyMail = 'no-reply@yourdomain.in',
    ideasMail = 'ideas@yourdomain.in';

function sendDefaultPassword(defaultPwd, player){
    var mailOptions={
        from: noreplyMail,
        to : player.emailid,
        subject : 'Reset password',
        //text : 'This is testing of email sending. Congrats! Its working.',
        html: '<p>Your html formatted message for user.</p>'
    };

    return smtpTransport.sendMail(mailOptions);
}

function sendValidationMail(validationId, data) {
    var mailOptions={
        from: noreplyMail,
        to : data.emailid,
        subject : 'Validate your account ',
        //text : 'This is the validation mail.',
        html: '<p>Appropriate message for user</p>'
    };

    return smtpTransport.sendMail(mailOptions);
}
module.exports = {sendDefaultPassword: sendDefaultPassword, sendValidationMail: sendValidationMail};