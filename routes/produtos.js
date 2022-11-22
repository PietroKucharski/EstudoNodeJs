const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todos os produos'
    })
});

router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };

    res.status(201).send({
        mensagem: 'Inseri um produto',
        produtoCriado: produto
    })
});

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    if(id === 'especial') {
        res.status(200).send({
            mensagem: 'Usando GET de um produto exclusivo',
            id: id 
        });
    } else {
        res.status(200).send({
            mensagem: 'Você passou um id'
        });
    }
})

router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando PATCH dentro da rota de produto'
    })
});

router.delete('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Usando DELETE dentro da rota de produto'
    })
})

module.exports = router;