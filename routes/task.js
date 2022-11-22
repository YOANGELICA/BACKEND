const express = require('express')
const router = express.Router();
const { validarJWT } = require('../middlewares/validar-token');
const { listarTasks, crearTask, actualizarTask, eliminarTask, listarProjectTasks } = require('../controllers/task.js');

const { route } = require('./auth');

router.use( validarJWT )

router.get('/list', listarTasks )
router.post('/create/:id', crearTask )
router.get('/listPtasks/:id', listarProjectTasks)
// router.put('/:id', actualizarTask )
// router.delete('/:id', eliminarTask )

module.exports = router;