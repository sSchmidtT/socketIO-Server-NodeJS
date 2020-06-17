const connection = require('../database/connection');

module.exports = {
    
    async create({type, active = true, parent, device_id, pinname, pintype, number}){
        
        const device = await connection('pinout').insert({
            pinname,
            type,
            pintype,
            number,
            active,
            parent,
            device_id
        });
        return device;
    },

    async listAll(accesslevel){
        return await connection('pinout')
        .join('device', 'device.id', '=', 'pinout.device_id')
        .where('pinout.accesslevel', '<=', accesslevel)
        .andWhere('pinout.active', true)
        .select(['pinout.*','device.name', 'device.socketIO','device.mac', 'device.active']);
    },

    async listWhere(condition = {}){
        return await connection('pinout').where(condition)
        .join('device', 'device.id', '=', 'pinout.device_id')
        .select(['pinout.*','device.name', 'device.socketIO','device.mac', 'device.active']);
    },

    async pinout(id){
        return await connection('pinout')
        .join('device', 'device.id', '=', 'pinout.device_id')
        .where('pinout.id', id)
        .select(['pinout.*','device.name', 'device.socketIO','device.mac', 'device.active'])
        .first();
    },

    async alter({id, type, active = true, parent, device_id, pinname, pintype, number}){
        return await connection('device').where('id', '=', id)
            .update({
                id, 
                pinname,
                type,
                pintype,
                number,
                active,
                parent,
                device_id
            });
    },
    async del(condition){
        var pinout = await connection('pinout').where(condition).select('id').first();

        if(pinout.id != condition.id){
            return {};
        }
        return await connection('pinout').where(condition).delete();
    }
    
}