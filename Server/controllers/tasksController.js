const { default: mongoose } = require("mongoose");
const Stage = require("../models/Stage");
const Task = require("../models/Task");
const { getCurrentDate } = require("../utils/getDate");

exports.getTasks = async (req, res) => {
  const { stageId, page } = req.query;
  const limit = 3;
  
  try {
    const tasks = await Task.find({ stageId })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalTasks = await Task.countDocuments({ stageId });
    res.status(200).json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      hasMore: page * limit < totalTasks,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tasks', error: err.message });
  }
}

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
    
    await Task.findByIdAndDelete(task._id);
    await stage.save() 

    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.updateTaskStage = async (req, res) => {
  const { taskId, stageId, position } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldStageId = task.stageId; 
    task.stageId = stageId; 
    
    await task.save();

    const oldStageObjectId = mongoose.Types.ObjectId(oldStageId);
    const taskObjectId = mongoose.Types.ObjectId(taskId);

    await Stage.findByIdAndUpdate(oldStageObjectId, { $pull: { taskIds: taskObjectId } });

    const destinationStage = await Stage.findById(stageId);
    if (!destinationStage) return res.status(404).json({ message: 'Destination stage not found' });
    
    destinationStage.taskIds.splice(position, 0, task._id);
    await destinationStage.save();

    res.json({ message: 'Task stage updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task stage', error });
  }
};

exports.updateTaskOrder = async (req, res) => {
  const { taskId, position } = req.body; 

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const stage = await Stage.findById(task.stageId);
    if (!stage) return res.status(404).json({ message: 'Stage not found' });
    const currentIndex = stage.taskIds.indexOf(task._id);
    if (currentIndex === -1) return res.status(400).json({ message: 'Task not found in stage' });

    stage.taskIds.splice(currentIndex, 1);
    stage.taskIds.splice(position, 0, task._id);

    await stage.save();

    res.json({ message: 'Task order updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task order', error });
  }
};