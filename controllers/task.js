const express = require('express');
const Task = require('../models/task');
const Usuario = require('../models/usuario');


const crearTask = async (req, res = express.request) => {
    const task = new Task(req.body);

    try {
        
        const user = await Usuario.findOne({email: req.body.user});
        task.user = user.id
        task.equipo = req.params.id;
        const saved = await task.save();
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

const listarTasks = async (req, res = express.request) => {
    const id = req.uid
    const tasks = await Task.find({user: id})
                                .populate('user','name');
    try {
        res.status(200).json({
            ok: true,
            tasks,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const listarProjectTasks = async (req, res = express.request) => {
    const id = req.params.id
    const tasks = await Task.find({equipo: id})
                                .populate('equipo','title').populate('user','name');
    try {
        res.status(200).json({
            ok: true,
            tasks,
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
    crearTask,
    listarTasks,
    listarProjectTasks,
}