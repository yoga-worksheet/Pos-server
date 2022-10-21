const express = require("express");
const router = express.Router();
const { policyCheck } = require("../../middleware");
const cartController = require("./controller");

router.get("/carts", policyCheck("read", "Cart"), cartController.index);
router.put("/cart", policyCheck("update", "Cart"), cartController.update);

module.exports = router;
