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
    type: Date
  },
  stages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage', // References the Stage model
    },
  ],
});

module.exports = mongoose.model('Project', projectSchema);