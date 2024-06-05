const authController = require("../controllers/authController");

const express = require("express");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/googlelogin", authController.googleLogin);

module.exports = router;
