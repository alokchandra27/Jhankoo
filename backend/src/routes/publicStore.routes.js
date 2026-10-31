const express = require("express");
const router = express.Router();
const publicStoreController = require("../controllers/publicStore.controller");

router.get("/:username", publicStoreController.getSellerStoreByUsername);

module.exports = router;