var express = require('express'),
    https = require('https'),
    http = require('http'),
    fs = require('fs'),
    favicon = require('express-favicon'),
    jwt = require('jsonwebtoken'),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan      = require('morgan'),
    mongoose = require('mongoose'),
    config = require('./snakedb/config'),
    expressValidator = require('express-validator'),
    helmet = require('helmet'),
    dbUnAuthRoutes = require('./snakedb/unauthenticated-routes'),
    dbAuthRoutes = require('./snakedb/authenticated-routes');
    app = express();

    //since the mongoose promise has been deprecated attaching the pluigin providing promise functionality
    mongoose.Promise = require('bluebird');

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
//for redirecting https://www.yourdomain.in to https://yourdomain.in
app.use(function(req, res, next){
    var host = req.get('host');
    console.log('inside www redirect');
    if(host.match(/^www/) !== null){
        return res.redirect(302, 'https://'+host.replace(/^www\./, '') + req.url);
    }
    /*if(host.indexOf('www') == -1){
        return res.redirect(302, 'https://www.'+host);
    }*/
    else
        next();
});

var resourcePath, httpsPort, httpPort, sslOpts, mongodbConnection;

if (process.env.NODE_ENV == 'production') {
    resourcePath = path.join(__dirname+'/public');
    httpsPort = 443;
    httpPort = 80;
    sslOpts = {
        key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.in/privkey.pem', 'utf8'),//keys/0000_key-certbot.pem
        cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.in/cert.pem', 'utf8')//csr/0000_csr-certbot.pem
    };
    mongodbConnection = 'mongodb://'+config.mongodbuser+':'+config.secret+'@AmazonHostedServerIP/snakedb';
}
else {
    //development
    resourcePath = path.join(__dirname+'/app');
    httpsPort = 3000;
    httpPort = 8080;
    sslOpts = {
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem')
    };
    mongodbConnection = config.database;
}

//__dirname represent the current directory path of where this js file is placed
app.use(express.static(resourcePath, {etag: false, lastModified: false}));

app.use(favicon(resourcePath + '/favicon.png'));

app.use(dbUnAuthRoutes.unAuthRoutes);
app.use('/api', dbAuthRoutes.authRoutes);

app.get('/', function(req, res) {
    res.sendFile(path.join(resourcePath + '/index.html'));
});

mongoose.connect(mongodbConnection, function(err){
    if(err){
        console.log('Unable to connect to mongo', err);
    }
    else{
        console.log('Connected to snakedb database');
    }
});

//https://gaboesquivel.com/blog/2014/nodejs-https-and-ssl-certificate-for-development/
https.createServer(sslOpts, app).listen(httpsPort, function(){
    console.log('HTTPS Server listening on port', httpsPort, 'and started in', process.env.NODE_ENV, 'mode.');
});

//for redirecting http to https
var httpApp = express();
function requireHttps(req, res, next) {
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect(302, 'https://'+req.get('host'));
    }
    next();
}

httpApp.use(requireHttps);

http.createServer(httpApp).listen(httpPort, function (req, res) {
    console.log('HTTP Server listening on port', httpPort, 'and started in', process.env.NODE_ENV, 'mode.');
});
