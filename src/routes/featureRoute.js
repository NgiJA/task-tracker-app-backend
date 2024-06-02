const featureController = require("../controllers/featureController");

const express = require("express");

const router = express.Router();

router.get("/user", featureController.getUser);
router.post("/createtask", featureController.createTask);
router.get("/gettask", featureController.getTask);
router.delete("/deletetask/:taskId", featureController.deleteTask);
router.patch("/edittask/:taskId", featureController.editTask);
router.patch("/toggletask/:taskId", featureController.toggleTask);

module.exports = router;
