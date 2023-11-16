const express = require('express');
const router = express.Router();
const CompraCtrl = require('../controller/compras.controller')
const Auth = require('../middlewares/authService')



router.get('/compraPrueba', [Auth] , CompraCtrl.compraPrueba)
router.get('/boletasBy/:id', CompraCtrl.getBoletasBy)
router.post('/winner/:id', [Auth] ,CompraCtrl.getWinner)
router.post('/comprar/:id?/:cant?', CompraCtrl.comprar)
router.delete('/removeboletas/:id',[ Auth ],CompraCtrl.removeBoletas)




module.exports = router