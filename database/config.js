const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        mongoose.connect ( process.env.DB_CONNECTION, {
            autoIndex: true
        })
        console.log('DB ONLINE')
    } catch(error) {
        console.log(error)
        throw new Error('Error al conectar en DB');
    }
}
module.exports = {dbConnection}