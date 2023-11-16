const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivos, removeImagenes, updateImage } = require('../controller/uploas.controller')
const Auth = require('../middlewares/authService')


const router = Router()

router.post('/:titulo?',[Auth], cargarArchivos)
router.put('/update/:titulo?', [Auth] , updateImage )
router.delete('/remove/:titulo?', [Auth],  removeImagenes)



module.exports = router