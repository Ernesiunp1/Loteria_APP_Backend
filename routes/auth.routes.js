const express = require('express')
const router = express.Router()
const AuthCtrl = require('../controller/auth.controller')
const { model } = require('mongoose')



router.post('/auth', AuthCtrl.checkAuth )
router.post('/user/create', AuthCtrl.createUser )
router.post('/login', AuthCtrl.login )
router.put('/user', AuthCtrl.updateUser )



module.exports = router