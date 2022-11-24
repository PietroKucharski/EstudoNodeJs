const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/')
    },
    filename: function( req, file, cb ){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/octet-stream' || file.mimetype === 'image/jpeg') {
        cb(null, true); // Caso não queira que passe pelo filtro apenas trocar a segunda propriedade para false 
    } else {
        cb(null, false);
    }

}

const upload = multer({ storage: storage, fileFilter: fileFilter }) // fileSize é um filtro para a imagem

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'SELECT * FROM produtos',
            (error, result, fields) => {
                if(error) {
                    return res.status(500).send({
                        error: error
                    });
                }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produtos: prod.id_produtos,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: 'http://localhost:3001/produtos/' + prod.id_produtos
                            }
                        }
                    })
                }
                return res.status(200).send({ response });
            }
        );
    });
});

router.post('/', upload.single('produto_imagem'), (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release(); // Sempre fazer isto
                if(error) {
                    return res.status(500).send({
                        error: error
                    });
                }
                const response = {
                    mensagem: 'Produto inseritdo com sucesso',
                    produtoCriado: {
                        id_produtos: result.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http://localhost:3001/produtos'
                        }
                    }
                    
                }
                res.status(201).send({ response });
            }
        );
    });
});

router.get('/:id_produtos', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?;',
            [req.params.id_produtos],
            (error, result, fields) => {
                if(error) {
                    return res.status(500).send({
                        error: error
                    });
                }
                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o produto com esse ID'
                    })
                }
                const response = {
                    produto: {
                        id_produtos: result[0].id_produtos,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produto',
                            url: 'http://localhost:3001/produtos'
                        }
                    }
                    
                }
                return res.status(200).send({ response });
            }
        );
    });
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produtos = ?',
            [req.body.nome, req.body.preco, req.body.id_produtos],
            (error, result, field) => {
                conn.release(); // Sempre fazer isto
                if(error) {
                    return res.status(500).send({
                        error: error
                    });
                }
                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produtos: req.body.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Atualiza os dados de um produto',
                            url: 'http://localhost:3001/produtos/' + req.body.id_produtos
                        }
                    }
                    
                }
                res.status(202).send({ response });
            }
        );
    });
});

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'DELETE FROM produtos WHERE id_produtos = ?',
            [req.body.id_produtos],
            (error, result, field) => {
                conn.release(); // Sempre fazer isto
                if(error) {
                    return res.status(500).send({
                        error: error
                    });
                }
                const response = {
                    menssagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3001/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number/Integer',
                        }
                    }
                }
                res.status(202).send({ response });
            }
        );
    });
})

module.exports = router;