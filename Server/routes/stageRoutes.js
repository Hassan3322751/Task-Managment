const express = require("express");
const router = express.Router();
const { getStage, postStage, deleteStage } = require("../controllers/stagesControllers");

// Routes beginning with /api/tasks
// router.get("/", getProjects);
router.get("/:stageId", getStage);
router.delete("/:stageId", deleteStage);
router.post("/", postStage);
// router.post("/", postProject);
// router.put("/:taskId", putProject);
// router.delete("/:projectId", deleteProject);

module.exports = router;