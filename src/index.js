require('dotenv-safe').config({silent: true});
var state = require('./lib/state');
var appState = new state();

const user = "sSchmidtT"; //insert in data-base user table
const pswd = "207010";

var app = require('./app')(appState);

var http = require('http').createServer(app);

var io = require('socket.io')(process.env.PORT || 3005);

const deviceController = require('./controllers/deviceController');
const eventController = require('./controllers/eventController');

io.attach(http, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

io.set('authorization', function (handshakeData, callback) {
    // make sure the handshake data looks good
    console.log(handshakeData.headers.authorization);
    let auth = handshakeData.headers.authorization;

    let data = auth.split(' ');
    let buff = Buffer.from(data[1], 'base64');
    let text = buff.toString('utf-8');
    console.log(text);

    let userSenha = text.split(":");
    if(userSenha.length > 0){
        let userRec = userSenha[0];
        let senha = userSenha[1].split("|");
        if(userRec == user && senha.length == 3){
            let tKey = parseInt(senha[2]);
            let key = senha[1].substring(0,tKey);
            let restante = senha[1].substring(tKey, senha[1].length);
            let pos = 0;
            let pswdRec = "";
            for(let i = 0; i < key.length; i++){
                pos += !isNaN(key[i]) ? parseInt(key[i]) : -1;
                let posFim = pos + 1;
                pswdRec += restante.substring(pos,posFim);
                pos = posFim;
            }
            console.log(pswdRec);
            if(pswd ==  pswdRec){
                callback(null, true); // error first, 'authorized' boolean second
            }else{
                callback("Unauthenticated user", false); // error first, 'authorized' boolean second
            }
        }else{
            callback("Unauthenticated user", false); // error first, 'authorized' boolean second
        }
    }
     
  });

io.on('connection', function(socket){
    socket.emit("create", "envie as configuraçoes.");

    console.log('user connected ', socket.id);

    socket.on('disconnect', function(){
        console.log('user disconnected ' + socket.id);
    });

    socket.on('message', function(msg){
        console.log("message: " + msg);
    });

    socket.on('created', async function(dev){
        const ret = await deviceController.created(dev, socket.id)
        if(ret.length > 0){
            for (var i = 0; i < ret.length; i++){
                appState.update(ret[i]);
            }
        }else{
            socket.emit('reply', "Dispositivo cadastrada com sucesso");
        }
    });

    socket.on('realized', async function(command){
        console.log(command);
        await eventController.alter(command);
    })
});

appState.addObserver((command) => {
    var socketId = command.socketId;
    console.log(socketId);
    console.log(JSON.stringify(command));
    if(socketId){
        io.to(socketId).emit(command.emit, command);
        console.log('send socketIO especific client');
    }
    else{
        io.emit(command.emit, command);
        console.log('send broadcast client');
    }
});

http.listen(process.env.PORT || 3000,() => {
    console.log('Servidor de exemplo aberto na porta: 3000')
});

function timeout(){
    setTimeout(function(){
        io.emit('reply', 'A message from server');
        timeout();
    }, 5000);
}