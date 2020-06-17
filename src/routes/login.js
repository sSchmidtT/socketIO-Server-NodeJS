const express = require('express');
const userController = require('../controllers/userController');

module.exports = function(jwt){
    const router = express.Router();

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        //console.log('req: ', req);
        console.log('Time: ', Date.now());
        next();
    });

    router.post('/', async function(req, res){
        console.log(req.body);
        var user = await userController.user(req.body.user);
        console.log(user);
        if(user && req.body.pws === user.pws){
            const id = user.id;
            const accesslevel = user.accesslevel;
            var token = jwt.sign({id, accesslevel}, process.env.SECRET,{
                expiresIn: 3600
            });
            return res.json({auth: true, token: token});
        }
        res.status(500).json({auth: false, message: 'Login ou senha inválido'});
    });

    return router;
}