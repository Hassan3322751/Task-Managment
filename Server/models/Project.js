// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String, // Assuming you want the date as a string
    default: () => {
      const today = new Date();
      const dateOnly = today.toISOString().split('T')[0];
      return dateOnly;
    }
  },
  stages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage', // References the Stage model
    },
  ],
});

module.exports = mongoose.model('Project', projectSchema);