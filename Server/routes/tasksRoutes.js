const express = require("express");
const { getTask, deleteTask, postTask, updateTaskStage, updateTaskOrder, getTasks } = require("../controllers/tasksController");
const router = express.Router();

router.get("/", getTasks);
router.get("/:taskId", getTask);
router.delete("/:taskId", deleteTask);
router.post("/", postTask);
router.put("/updateStage", updateTaskStage);
router.put("/updateOrder", updateTaskOrder);

module.exports = router;