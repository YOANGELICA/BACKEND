const express = require('express');
const Equipos = require('../models/Equipos');
const Usuario = require('../models/usuario');
const EquiposUsuarios = require('../models/equiposUsuarios');

const crearEquipos = async (req, res = express.request) => {
    const {title, deadline, description, project_users} = req.body;

    const equipos = new Equipos({title, deadline, description}); // creando el objeto equipo

    const lista = project_users.split(',')

    try {
        const saved = await equipos.save(); // guradando el objeto equipo en mongo

        // recorrer la lista y buscar en la tabla de usuarios por correo
        // si se halla el usuario:
        for (let i = 0; i < lista.length; i++) {
            var email = lista[i]
            var query = await Usuario.findOne({email: email})
            if (query){
                const equiposUsuarios = new EquiposUsuarios({user:query.id, equipo: saved.id});
                await equiposUsuarios.save();
            }
        }
        res.json({
            ok:true,
            task: saved
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            task: 'Internal error'
        })
    }
}

const listarEquipos = async (req, res = express.request) => {
    const uid = req.uid
    const equipos = await EquiposUsuarios.find({user: uid})
                                .populate('equipo', 'title')
    // console.log(uid)
    try {
        res.status(200).json({
            ok: true,
            equipos,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const mostrarEquipos = async (req, res = express.request) => {
    const id = req.params.id
    const equipos = await Equipos.findById(id)
    try {
        res.status(200).json({
            ok: true,
            equipos,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const eliminarEquipos = async (req, res = express.request) => {
    const id = req.params.id
    const equipo = await Equipos.findByIdAndDelete(id)
    try {
        res.status(200).json({
            ok: true,
            equipo,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const listarUsuarios = async (req, res = express.request) => {
    const id = req.params.id
    const usuarios = await EquiposUsuarios.find({equipo: id})
                                .populate('user')
    // console.log(id)
    try {
        res.status(200).json({
            ok: true,
            usuarios,
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
    crearEquipos,
    listarEquipos,
    eliminarEquipos,
    listarUsuarios,
    mostrarEquipos
}