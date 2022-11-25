const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const produtosController = require('../controllers/produtos-controller');
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

router.get('/', produtosController.getProdutos);
router.post('/', login.obrigatorio, upload.single('produto_imagem'), produtosController.postProdutos);
router.get('/:id_produtos', produtosController.getUmProduto);
router.patch('/', produtosController.patchProdutos);
router.delete('/', produtosController.deleteProdutos);

module.exports = router;