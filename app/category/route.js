const express = require("express");
const { policyCheck } = require("../../middleware");
const router = express.Router();
const categoryController = require("./controller");

router.get("/categories", categoryController.index);
router.post(
	"/category",
	policyCheck("create", "Category"),
	categoryController.store
);
router.put(
	"/category/:id",
	policyCheck("update", "Category"),
	categoryController.update
);
router.delete(
	"/category/:id",
	policyCheck("delete", "Category"),
	categoryController.destroy
);

module.exports = router;
