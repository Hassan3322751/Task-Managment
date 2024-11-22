const { default: mongoose } = require("mongoose");
const Stage = require("../models/Stage");
const Task = require("../models/Task");
const { getCurrentDate } = require("../utils/getDate");

exports.getTasks = async (req, res) => {
  const { stageId, page = 1 } = req.query;
  const limit = 3;

  try {
    const stage = await Stage.findById(stageId);
    if (!stage) {
      return res.status(404).json({ msg: 'Stage not found' });
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const taskIdsForPage = stage.taskIds.slice(startIndex, endIndex);
    const tasks = await Task.find({ _id: { $in: taskIdsForPage } }).exec();

    const orderedTasks = taskIdsForPage.map((id) => 
      tasks.find((task) => task._id.equals(id))
    );

    const totalTasks = stage.taskIds.length;
    const totalPages = Math.ceil(totalTasks / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      tasks: orderedTasks,
      currentPage: page,
      totalPages,
      hasMore,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ msg: 'Error fetching tasks', error: err.message });
  }
};

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

exports.updateTask = async (req, res) => {  
  const {task} = req.body
  try {
    await Task.findByIdAndUpdate(task._id, task)
    
    res.status(200).send();
  }
  catch (err) {
    console.error("UpdateTask Error: " + err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postTask = async (req, res) => {
    const {task, stageId} = req.body;
    const {title, description, dueDate} = task

    const stage = await Stage.findById(stageId)
    
    try {
      const newTask = new Task({
        title: title,
        description: description,
        dueDate: dueDate,
        stageId,
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
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const oldStageObjectId = mongoose.Types.ObjectId(task.stageId);
    const taskObjectId = mongoose.Types.ObjectId(taskId);
    
    const oldStage = await Stage.findById(oldStageObjectId);
    if (!oldStage) {
      return res.status(404).json({ message: 'Old stage not found' });
    }
    oldStage.taskIds = oldStage.taskIds.filter(id => id && !id.equals(taskObjectId));
    
    const destinationStage = await Stage.findById(stageId);
    if (!destinationStage) {
      return res.status(404).json({ message: 'Destination stage not found' });
    }
    destinationStage.taskIds.splice(position, 0, taskObjectId);
    
    task.stageId = stageId;
    
    await task.save();
    await oldStage.save();
    await destinationStage.save();

    res.json({ message: 'Task stage updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task stage', error: error.message });
  }
};

exports.updateTaskOrder = async (req, res) => {
  let { taskId, updatedOrder } = req.body; 

  try {
    if (typeof taskId === 'string') taskId = mongoose.Types.ObjectId(taskId);

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const stage = await Stage.findById(task.stageId);
    
    if (!stage) return res.status(404).json({ message: 'Stage not found' });
    stage.taskIds = updatedOrder
  
    await stage.save(); 

    res.json({ message: 'Task order updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task order', error });
  }
};