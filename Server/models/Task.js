// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage', // References the Stage model
    required: true,
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Task', taskSchema);
