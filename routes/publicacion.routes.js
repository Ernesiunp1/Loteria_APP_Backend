const express = require("express")
const router = express.Router()
const PublicacionCtrl = require("../controller/publicacion.controller")
const Auth = require("../middlewares/authService")




router.get('/prueba1',PublicacionCtrl.prueba )
router.get('/publicaciones',  PublicacionCtrl.getPublicacion )
router.get('/detalle/:id?',  PublicacionCtrl.getDetail )
router.post('/publicacion/:titulo?', [Auth] ,PublicacionCtrl.createPublicacion)
router.put('/update/:id', [Auth] , PublicacionCtrl.updatePubli)
router.delete('/delete/:id', [Auth] ,PublicacionCtrl.removePubli)




module.exports = router