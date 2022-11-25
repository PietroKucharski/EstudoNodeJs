const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(`SELECT * FROM  usuarios WHERE email = ?`,
        [req.body.email],
        (error, result, fields) => {
            if(error) {
                return res.status(500).send({
                    error: error
                });
            }
            if(result.length > 0) {
                res.status(409).send({
                    mensagem: 'Usuario já cadastrado'
                });
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(errBcrypt) {
                        return res.status(500).send({
                            error: errBcrypt
                        });
                    }
                    conn.query(`INSERT INTO usuarios (email, senha) VALUES (?, ?)`,
                    [req.body.email, hash],
                    (error, result, fieldss) => {
                        conn.release();
                        if(error) {
                            return res.status(500).send({
                                error: error
                            });
                        }
                        const response = {
                            mensagem: "Usuario criado com sucesso",
                            usuarioCriado: {
                                email: req.body.email,
                                id_usuario: result.insertId,
                            }
                        }
                        return res.status(201).send(response);
                    }
                    );;
                });
            }
        }
        );
    });
};

exports.loginUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({
                error: error
            });
        }
        const query = `SELECT * FROM  usuarios WHERE email = ?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if(error) {
                return res.status(500).send({
                    error: error
                });
            }
            if(results.length < 1) {
                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                });
            }
            bcrypt.compare(req.body.senha, results[0].senha, (error, result, fields) => {
                if(error) {
                    return res.status(401).send({
                        mensagem: 'Falha na autenticação'
                    });
                }
                if(result) {
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario, // Forma do video = result[0].id_usuario
                        email: results[0].email, // Forma do video = result[0].email
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).send({
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                });
            });
        });
    });
};