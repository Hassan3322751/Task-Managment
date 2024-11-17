const { default: mongoose } = require("mongoose");
const Stage = require("../models/Stage");
const Task = require("../models/Task");
const { getCurrentDate } = require("../utils/getDate");

exports.getTasks = async (req, res) => {
  const { stageId, page = 1 } = req.query;
  const limit = 3;

  try {
    // Find the stage and retrieve taskIds
    const stage = await Stage.findById(stageId);
    if (!stage) {
      return res.status(404).json({ msg: 'Stage not found' });
    }

    // Calculate the start and end indices for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Slice the taskIds array for the current page
    const taskIdsForPage = stage.taskIds.slice(startIndex, endIndex);

    // Retrieve tasks using the sliced array of IDs
    const tasks = await Task.find({ _id: { $in: taskIdsForPage } }).exec();

    // Manually sort the tasks according to the order in taskIdsForPage
    const orderedTasks = taskIdsForPage.map((id) => 
      tasks.find((task) => task._id.equals(id))
    );

    // Calculate pagination info
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

// exports.getTasks = async (req, res) => {
//   const { stageId, page } = req.query;
//   const limit = 3;
  
//   try {
//     const tasks = await Task.find({ stageId })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec();

//     const totalTasks = await Task.countDocuments({ stageId });
//     res.status(200).json({
//       tasks,
//       currentPage: page,
//       totalPages: Math.ceil(totalTasks / limit),
//       hasMore: page * limit < totalTasks,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: 'Error fetching tasks', error: err.message });
//   }
// }

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
        // createdAt: getCurrentDate(),
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
  console.log(taskId, stageId, position)
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldStageObjectId = mongoose.Types.ObjectId(task.stageId);
    const taskObjectId = mongoose.Types.ObjectId(taskId);
    
    const oldStageId = task.stageId; 
    await Stage.findByIdAndUpdate(oldStageObjectId, { $pull: { taskIds: taskObjectId } });
    
    const destinationStage = await Stage.findById(stageId);
    if (!destinationStage) return res.status(404).json({ message: 'Destination stage not found' });
    
    destinationStage.taskIds.splice(position, 0, task._id);
    task.stageId = stageId;  
    
    await task.save();
    await destinationStage.save();

    res.json({ message: 'Task stage updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task stage', error });
  }
};

exports.updateTaskOrder = async (req, res) => {
  let { taskId, updatedStage } = req.body; 

  try {
    if (typeof taskId === 'string') taskId = mongoose.Types.ObjectId(taskId);

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const stage = await Stage.findById(task.stageId);
    
    if (!stage) return res.status(404).json({ message: 'Stage not found' });
    stage.taskIds = updatedStage.taskIds

    await stage.save();

    res.json({ message: 'Task order updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task order', error });
  }
};