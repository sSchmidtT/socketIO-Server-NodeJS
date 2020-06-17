const connection = require('../database/connection');

module.exports = {
    async create({command, pinout_id, realized = false}){
        let created_at = Date.now();
        const event = await connection('event').insert({
            command,
            realized,
            pinout_id,
            created_at
        });
        return event;
    },

    async listAll(){
        return await connection('event').select('*');
    },

    async listWhere(condition = {}){
        return await connection('event').where(condition).select('*');
    },

    async alter({id, realized, date_realized }){
        return await connection('event').where('id', '=', id).update({realized, date_realized});
    },

    async del(id){
        var pinout = await connection('event').where('id', id).select('id').first();

        if(pinout.id != id){
            return {};
        }
        return await connection('event').where('id', id).delete();
    }
}