const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos-controller')

router.get('/', pedidosController.getPedidos);
router.post('/', pedidosController.postPedidos);
router.get('/:id_pedidos', pedidosController.getUmPedido)
router.delete('/', pedidosController.deletePedidos)

module.exports = router;