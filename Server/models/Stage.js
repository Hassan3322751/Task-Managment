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
  createdAt: {
    type: String, // Assuming you want the date as a string
    default: () => {
      const today = new Date();
      const dateOnly = today.toISOString().split('T')[0];
      return dateOnly;
    }
  },
});

module.exports = mongoose.model('Stage', stageSchema);
