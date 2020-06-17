const connection = require('../database/connection');

module.exports = {
    async create({user, pws, name, email}){
        var usr = await connection('user').insert({
            user: user,
            pws :  pws,
            name : name,
            email : email,
            active : false
        });
        return usr;
    },
    async alter({user, pws, name, email, id, active = true}){
        var usr = await connection('user').where('id', '=', id).update({
            user: user,
            pws :  pws,
            name : name,
            email : email,
            active : active
        });
        return usr;
    },

    async user(usr){
        return await connection('user').where('user', '=', usr).select('*').first();
    },

    async users(){
        return await connection('user').select('*');
    }
};