
const express = require('express');

module.exports = function(appState){
    const router = express.Router();
    var command ;
    var response ;
    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        //console.log('req: ', req);
        console.log('Time: ', Date.now());
        next();
    });

    router.get('/', function(req, res, next){
        response = {};
        response = {status: 200, msg: "evento cadastrado com sucesso"};
        
        next();
    });

    router.post('/', function(req, res, next){
        response = {};
        response = {status: 200, msg: "evento cadastrado com sucesso"};
        command = {};
        command = {socketId: "1as4d54a5sd45a"};
        next();
    })

    router.use(function notifySub(req, res){
        if(command){
            appState.update(command);
        }
        res.status(response['status']).json(response['msg']);
    });

    //other routes..
    return router;
}