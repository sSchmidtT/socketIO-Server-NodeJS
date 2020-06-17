const express = require('express');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cors = require('cors');

module.exports = function(state){
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors());

    const login = require('./routes/login')(jwt);
    const events = require('./routes/events')(state);
    const device = require('./routes/device')(state);
    const pinout = require('./routes/pinout')(state);
    //app.use(express.json());
    app.use('/login', login);
    app.use('/events', verifyJWT, events);
    app.use('/device', verifyJWT, device);
    app.use('/pinout', verifyJWT, pinout);

    return app;
}

function verifyJWT(req, res, next){
    var token = req.headers['x-access-token'];
    if(!token) return res.status(400).json({auth: false, message: 'No token provided.'});
    jwt.verify(token, process.env.SECRET_JWT, function(err, decoded){
        if(err) return res.status(500).json({auth: false, message: 'Failed to authenticate token'});

        req.userId = decoded.id;
        req.accesslevel = decoded.accesslevel;
        next();
    });
}