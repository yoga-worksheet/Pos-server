const express = require("express");
const router = express.Router();
const { policyCheck } = require("../../middleware");
const deliveryAddressController = require("./controller");

router.get(
	"/delivery-addresses",
	policyCheck("view", "DeliveryAddress"),
	deliveryAddressController.index
);
router.post(
	"/delivery-address",
	policyCheck("create", "DeliveryAddress"),
	deliveryAddressController.store
);
router.put("/delivery-address/:id", deliveryAddressController.update);
router.delete("/delivery-address/:id", deliveryAddressController.destroy);

module.exports = router;
