const express = require("express");
const CtrlPref = require("../controller/preferencia.controllers");

const router = express.Router();

router.post("/generar/", CtrlPref.generar);

module.exports = router;
