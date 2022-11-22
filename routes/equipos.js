const express = require('express')
const router = express.Router();
const { validarJWT } = require('../middlewares/validar-token');
const { crearEquipos, listarEquipos, eliminarEquipos, listarUsuarios, mostrarEquipos } = require('../controllers/equipos.js');


router.use( validarJWT )

router.post('/create', crearEquipos)
router.get('/list', listarEquipos)
router.delete('/delete', eliminarEquipos)
router.get('/listUsers/:id', listarUsuarios)
router.get('/show/:id', mostrarEquipos)


module.exports = router;