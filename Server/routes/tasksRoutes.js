const express = require("express");
const { getTask, deleteTask, postTask } = require("../controllers/tasksController");
const router = express.Router();

// Routes beginning with /api/tasks
// router.get("/", getProjects);
router.get("/:taskId", getTask);
router.delete("/:taskId", deleteTask);
router.post("/", postTask);
// router.post("/", postProject);
// router.put("/:taskId", putProject);
// router.delete("/:projectId", deleteProject);

module.exports = router;