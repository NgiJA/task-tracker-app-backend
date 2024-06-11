const emailController = require("../controllers/emailController");

const express = require("express");

const router = express.Router();

router.post("/send", emailController.sendEmail);

module.exports = router;
