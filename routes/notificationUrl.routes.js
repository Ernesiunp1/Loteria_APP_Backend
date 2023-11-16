const express = require("express");
const CtrlNotification = require("../controller/notificationUrl.controllers");

const router = express.Router();

router.post("/noti/:nombre/:apellido/:documento/:email/:telefono/:productoId/:cantidad", CtrlNotification.notificacion);

module.exports = router;
