const express = require("express");
const router = express.Router();
const { getTasks, getTask, postTask, putTask, deleteTask } = require("../controllers/taskControllers");

// Routes beginning with /api/tasks
router.get("/", getTasks);
router.get("/:taskId", getTask);
router.post("/", postTask);
router.put("/:taskId", putTask);
router.delete("/:projectId", deleteTask);

module.exports = router;
