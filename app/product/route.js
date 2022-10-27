const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");
const { policyCheck } = require("../../middleware");

const productController = require("./controller");

router.get("/products", productController.index);
router.get("/product/:id", productController.find);
router.post(
	"/product",
	multer({ dest: os.tmpdir() }).single("image"),
	policyCheck("create", "Product"),
	productController.store
);
router.put(
	"/product/:id",
	multer({ dest: os.tmpdir() }).single("image"),
	policyCheck("update", "Product"),
	productController.update
);
router.delete(
	"/product/:id",
	policyCheck("delete", "Product"),
	productController.destroy
);

module.exports = router;
