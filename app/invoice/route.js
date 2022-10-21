const express = require("express");
const router = express.Router();
const invoiceController = require("./controller");

router.get("/invoice/:order_id", invoiceController.index);

module.exports = router;
