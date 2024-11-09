const express = require("express");
const router = express.Router();
const { getStage, postStage, deleteStage } = require("../controllers/stagesControllers");

router.get("/:stageId", getStage);
router.delete("/:stageId", deleteStage);
router.post("/", postStage);

module.exports = router;