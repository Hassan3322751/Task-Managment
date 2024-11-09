const express = require("express");
const router = express.Router();
const { getProjects, getProject, postProject, putProject, deleteProject } = require("../controllers/projectsControllers");

// Routes beginning with /api/tasks
router.get("/", getProjects);
router.get("/:projectId", getProject);
router.post("/", postProject);
router.put("/:taskId", putProject);
router.delete("/:projectId", deleteProject);

module.exports = router;
