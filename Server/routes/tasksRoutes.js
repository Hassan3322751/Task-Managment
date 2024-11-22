const express = require("express");
const { getTask, deleteTask, postTask, updateTask, updateTaskStage, updateTaskOrder, getTasks } = require("../controllers/tasksController");
const router = express.Router();

router.get("/", getTasks);
router.post("/", postTask);
router.get("/:taskId", getTask);
router.delete("/:taskId", deleteTask);
router.put("/update", updateTask);
router.put("/updateStage", updateTaskStage);
router.put("/updateOrder", updateTaskOrder);

module.exports = router;