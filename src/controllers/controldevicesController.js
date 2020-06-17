const connection = require('../database/connection');

module.exports = {
    async create({device, fcmtoken, active = false, user_id}){
        var dev = await connection('controldevices').insert({
            device: device,
            fcmtoken :  fcmtoken,
            active : active,
            user_id : user_id
        });
        return dev;
    },
    async alter({device, fcmtoken, active = true, user_id}){
        var dev = await connection('controldevices').where('device', '=', device).update({
            device: device,
            fcmtoken :  fcmtoken,
            active : active,
            user_id : user_id
        });
        return dev;
    },

    async controldevice(dev){
        return await connection('controldevices').where('device', '=', dev).select('*').first();
    },

    async controldevices(){
        return await connection('controldevices').select('*');
    }
};