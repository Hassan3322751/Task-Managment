// models/Stage.js
const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // References the Project model
    required: true,
  },
  taskIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', // References the Task model
    },
  ],
});

module.exports = mongoose.model('Stage', stageSchema);
