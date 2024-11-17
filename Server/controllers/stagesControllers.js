const Project = require("../models/Project");
const Stage = require("../models/Stage");
const { getCurrentDate } = require("../utils/getDate");

exports.getStage = async (req, res) => {
  try {
    if (!req.params.stageId) {
        return res.status(400).json({ status: false, msg: "Project id not valid" });
    }
    
    const project = await Stage.findOne({_id: req.params.stageId });
    if (!project) {
      return res.status(400).json({ status: false, msg: "No project found.." });
    }

    res.status(200).send(project);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postStage = async (req, res) => {
  const {stage, projectId} = req.body;

  const project = await Project.findById(projectId)
  
  try {
    const newStage = new Stage({
      name: stage,
      projectId,
      taskIds: [],
      // createdAt: getCurrentDate(),
    });
    project.stages.push(newStage._id)
    await newStage.save();
    await project.save()

    res.status(201).send(newStage);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.deleteStage = async (req, res) => {
  try { 
    if (!req.params.stageId) {
        return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let stage = await Stage.findById(req.params.stageId);
    if (!stage) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }
    const project = await Project.findById(stage.projectId)
    project.stages = project.stages.filter((s) => !s.equals(req.params.stageId));

    await Stage.findByIdAndDelete(req.params.stageId);
    await project.save()

    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}