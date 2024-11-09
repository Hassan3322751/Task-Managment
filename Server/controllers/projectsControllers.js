const Project = require("../models/Project");
const Stage = require("../models/Stage");
const { getCurrentDate } = require("../utils/getDate");


exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).send(projects);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getProject = async (req, res) => {
  try {
    if (!req.params.projectId) {
      return res.status(400).json({ status: false, msg: "Project id not valid" });
    }

    const project = await Project.findOne({_id: req.params.projectId });
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

exports.postProject = async (req, res) => {
  const {name, description} = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      createdAt: getCurrentDate(),
    });
 
    await newProject.save();
    res.status(201).send(newProject);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.putProject = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ status: false, msg: "Description of task not found" });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let project = await Project.findById(req.params.taskId);
    if (!project) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    project = await Project.findByIdAndUpdate(req.params.projectId, { description }, { new: true });
    res.status(200).json({ project, status: true, msg: "Task updated successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}


exports.deleteProject = async (req, res) => {
  try {
    if (!req.params.projectId) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    await Project.findByIdAndDelete(req.params.projectId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}