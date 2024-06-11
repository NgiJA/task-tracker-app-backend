const passwordController = require("../controllers/passwordController");

const express = require("express");

const router = express.Router();

router.post("/reset", passwordController.resetPassword);

module.exports = router;
