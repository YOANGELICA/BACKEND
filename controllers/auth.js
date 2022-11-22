const express = require('express');
const bcrypt = require('bcryptjs');                         
const Usuario = require('../models/usuario');
// const { request } = require('express');
const { generarJWT } = require('../helpers/jwt');
// const { validationResult } = require('express-validator');

const crearUsuario = async(req, res = express.request ) => {
    const { name, email, password, role } = req.body
    try {

        let usuario = await Usuario.findOne( {email: email}) // buscar el usuario en la colección
        if (usuario) {
            return res.status(400).json({
                ok:false,
                msg: 'El usuario con ese correo ya existe',
            })
        }
        usuario = new Usuario( req.body );
        const salt = bcrypt.genSaltSync();                  // generar un "salt"
        usuario.password = bcrypt.hashSync(password, salt); // transforma la contraseña en texto plano con el "salt"
        await usuario.save();

        res.status(200).json({
            ok: true,
            usuario,
        })
    } catch(error) {
        console.log( error )
        res.status(500).json({
            ok: false,
            error, 
        })
    }
}

const loginUsuario = async (req, res = express.request ) => {
    const {email, password} = req.body
    try {
        let usuario = await Usuario.findOne({email: email}) // buscar el usuario por email
        if (!usuario) {                                     // en la colección de Usuario
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe',               
            })
        }

        const passwordValid = bcrypt.compareSync(password, usuario.password);
        if (!passwordValid) {                               // comparar la contraseña ingresada
            return res.status(400).json({                   // con la contraseña del usuario
                ok: false,
                msg: 'La contraseña no es válida',
            })
        }
        const token = await( generarJWT(usuario.id, usuario.name))
        res.status(200).json({                              // generar un token para la 
            ok: true,                                       // autenticación del usuario
            usuario,
            token
        })
        } catch(error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                error,
            })
            }
        }

const revalidarToken = async (req, res = express.request ) => {
    const {uid, name} = req

    const token = await( generarJWT(uid, name) )

    res.json({
        ok: true
    })
}

const mostrarPerfil = async (req, res) => {
    const id = req.uid
    const perfil = await Usuario.findById(id)
    try {
        res.status(200).json({
            ok: true,
            perfil,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    mostrarPerfil
}