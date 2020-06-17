
const express = require('express');
const eventController = require('../controllers/eventController');
const pinoutController = require('../controllers/pinoutController');

module.exports = function(appState){
    const router = express.Router();
    var sendCommand ;
    var response ;
    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        //console.log('req: ', req);
        console.log('Time: ', Date.now());
        next();
    });

    router.get('/', async function(req, res, next){
        var events = await eventController.listAll();
        response = {};
        response = {status: 200, msg: JSON.stringify(events)};
        
        next();
    });

    router.post('/', async function(req, res, next){
        var {command, pinout_id, realized} = req.body;
        var event = await eventController.create({command, pinout_id, realized})
        if(event){
            console.log(event[0]);
            var pinout = await pinoutController.pinout( pinout_id);
            console.log(JSON.stringify(pinout));
            response = {status: 200, msg: "Evento cadastrado com sucesso"};
            sendCommand = {}

            sendCommand.id = event[0];
            sendCommand.pinname = pinout.pinname;
            sendCommand.name = pinout.name;
            sendCommand.number = pinout.number;
            sendCommand.socketId = pinout.socketIO;
            sendCommand.emit = "create-event";
            sendCommand.command = command;
        }else
        response = {status: 204, msg: "Evento não cadastrado"};

        
        next();
    })

    router.use(function notifySub(req, res){
        if(sendCommand){
            console.log(sendCommand);
            appState.update(sendCommand);
        }
        res.status(response['status']).json(response['msg']);
    });

    //other routes..
    return router;
}