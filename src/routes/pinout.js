
const express = require('express');
const pinoutController = require('../controllers/pinoutController');

module.exports = function(appState){
    const router = express.Router();
    var command ;
    var response ;
    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });

    router.get('/', async function(req, res, next){
        response = {};
        console.log('user access id: ' + req.userId);
        var pinouts = await pinoutController.listAll(req.accesslevel);
        if(pinouts)
            response = {status: 200, msg: pinouts};
        else
            response = {status: 204, msg: "Nenhum dispositivo retornado."};
        
        next();
    });

    router.use(function notifySub(req, res){
        if(command){
            appState.update(command);
        }
        res.status(response['status']).json(response['msg']);
    });

    //other routes..
    return router;
}