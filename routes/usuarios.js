const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios-controller')

router.post('/cadastro', usuariosController.postUsuarios);
router.post('/login', usuariosController.loginUsuarios);

module.exports = router;