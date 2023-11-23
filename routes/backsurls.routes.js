const express = require("express");
const CtrlBacksUrls = require("../controller/backsurls.controllers");

const router = express.Router();

router.get("/success", CtrlBacksUrls.success);
router.get("/failure", CtrlBacksUrls.failure);

module.exports = router;
