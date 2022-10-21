const express = require("express");
const { policyCheck } = require("../../middleware");
const router = express.Router();
const tagController = require("./controller");

router.get("/tags", tagController.index);
router.post("/tag", policyCheck("create", "Tag"), tagController.store);
router.put("/tag/:id", policyCheck("update", "Tag"), tagController.update);
router.delete("/tag/:id", policyCheck("delete", "Tag"), tagController.destroy);

module.exports = router;
