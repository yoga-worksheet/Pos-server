const express = require("express");
const router = express.Router();
const orderController = require("./controller");
const { policyCheck } = require("../../middleware");

router.get("/orders", policyCheck("view", "Order"), orderController.index);
router.post("/order", policyCheck("create", "Order"), orderController.store); 

module.exports = router;
