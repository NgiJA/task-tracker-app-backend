const otpController = require("../controllers/otpController");

const express = require("express");

const router = express.Router();

router.post("/verify", otpController.verifyOTP);

module.exports = router;
