const express = require('express')
require('dotenv').config()
const { dbConnection } = require('../database/config')
const cors = require('cors')

class Server {
    constructor() {
        //Crear express app
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io     = require('socket.io')( this.server )

        this.paths = {
            auth: '/api/auth',
            task: '/api/task',
        }

        this.connectToDB();
        this.addMiddlewares();
        this.setRoutes();
        this.sockets()
    }


    //Base de datos
    async connectToDB() {
        await dbConnection();
    }

    addMiddlewares() {
        //CORS
        this.app.use( cors() )

        // Lectura y parseo del body
        this.app.use( express.json() );

        // public folder
        this.app.use( express.static('public') )
    }

    setRoutes() {
        // rutas
        this.app.use( this.paths.auth, require('../routes/auth'))
        this.app.use( this.paths.task, require('../routes/task'))
    }

    sockets(){
        this.io.on('connection', socket => {
            console.log('Cliente conectado', socket.id);

            socket.on('mensaje-de-cliente', ( payload, callback ) => {
                console.log( payload );

                callback('Tu mensaje fue recibido');

                payload.from = 'desde el server'
                this.io.emit('mensaje-de-server', payload);
                // this.io
            })

            socket.on('disconnect', () =>{
                console.log('Cliente desconectado');
            })
        })
    }

    listen() {
        // escuchar en el puerto 4000
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', process.env.PORT)
        })
    }
}

module.exports = Server;