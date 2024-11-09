const Stage = require("../models/Stage");
const Task = require("../models/Task");
const { getCurrentDate } = require("../utils/getDate");

exports.getTask = async (req, res) => {
  try {
    if (!req.params.taskId) {
        return res.status(400).json({ status: false, msg: "Project id not valid" });
    }
    
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found.." });
    }
    res.status(200).send(task);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postTask = async (req, res) => {
    const {task, stageId} = req.body;
    const {name, description, dueDate} = task

    const stage = await Stage.findById(stageId)
    
    try {
      const newTask = new Task({
        title: name,
        description: description,
        dueDate: dueDate,
        stageId,
        createdAt: getCurrentDate(),
    });

    
    stage.taskIds.push(newTask._id)
      await newTask.save();
      await stage.save()
  
      res.status(201).send(newTask);
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
  }

exports.deleteTask = async (req, res) => {
  try { 
    if (!req.params.taskId) {
        return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId); 
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }
    const stage = await Stage.findById(task.stageId)
    stage.taskIds = stage.taskIds.filter((s) => !s.equals(req.params.taskId));

    await Task.findByIdAndDelete(req.params.taskId);
    await stage.save()

    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}
