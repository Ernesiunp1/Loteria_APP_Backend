const express = require('express');
const route = express.Router();
const OpenCtrl = require('../controller/openPay.controller');
const router = require('./publicacion.routes');


route.post("/open", OpenCtrl) 



module.exports = route