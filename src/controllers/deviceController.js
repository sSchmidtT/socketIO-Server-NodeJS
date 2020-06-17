const connection = require('../database/connection');

module.exports = {
    async create({name, mac, active = false, socketIO}){
        
        const device = await connection('device').insert({
            name,
            mac,
            active,
            socketIO
        });
        return device;
    },

    async listAll(){
        return await connection('device').select('*');
    },

    async listWhere(condition = {}){
        return await connection('device').where(condition).select('*');
    },

    async device(condition = {}){
        return await connection('device').where(condition).select('*').first();
    },

    async alter({id, name, mac, active = true, socketIO}){
        console.log({id, name, mac, active, socketIO});
        return await connection('device').where('id', id).update({name, mac, active, socketIO});
    },

    async del(id){
        var device = await connection('device').where('id', id).select('id').first();

        if(device.id != id){
            return {};
        }
        return await connection('device').where('id', id).delete();
    },

    async created(devObj, socketIO){
        const {dev} = devObj;
        var cad = false;
        var retDev = new Array();
        const { name, mac, active} = dev;
        var device = await connection('device').where('name',dev.name).select('id').first();
        if(device){
            var id = device.id;
            device = await this.alter({id, name, mac, socketIO});
        }else{
            device = await this.create({name, mac, active, socketIO});
        }
        console.log(device);
        if(dev['pinOuts']){
            for(var i = 0; i < dev.pinOuts.length; i++){
                const {pinname, type, active = true, parent, number, pintype, accesslevel = 1} = dev.pinOuts[i];
                var pin = await connection('pinout').where({
                    pinname: pinname,
                    device_id : device
                }).select('id')
                .first().catch(function (err) {
                    console.error(err);
                });
                var device_id = device;
                if(pin){
                    var id = pin.id;
                    await connection('pinout').where('id',pin.id).update({id, pinname, type, active, number, pintype, parent, device_id}, accesslevel).catch(function (err) {
                        console.error(err);
                    });
                    var event = await connection('event').where('pinout_id', id).orderBy('created_at', 'desc').select('*').first();
                    console.log(JSON.stringify(event));
                    if(event){
                        var sendCommand = {}
                        sendCommand.id = event.id;
                        sendCommand.pinname = pinname;
                        sendCommand.name = name;
                        sendCommand.number = number;
                        sendCommand.socketId = socketIO;
                        sendCommand.emit = "create-event";
                        sendCommand.command = event.command;
                        retDev.push(sendCommand);
                    }

                }else{
                    pin = await connection('pinout').insert({pinname, type, active, number, pintype, parent, device_id}, accesslevel).catch(function (err) {
                        console.error(err);
                    });//name,type,active,parent, device_id
                }
                
            }
        }
        console.log(retDev);
        return retDev;
    }
}