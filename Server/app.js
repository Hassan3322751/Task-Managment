const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const stageRoutes = require("./routes/stageRoutes");
const tasksRoutes = require("./routes/tasksRoutes");


const User = require('./models/User');
const Project = require('./models/Project');
const Stage = require('./models/Stage');
const Task = require('./models/Task');

app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, err => {
  if (err) throw err;
  console.log("Mongodb connected...");
});

// mongoose.connection.on('connected', async () => {
//   console.log('Connected to MongoDB');

//   try {
//     // Clear existing data
//     await User.deleteMany({});
//     await Project.deleteMany({});
//     await Stage.deleteMany({});
//     await Task.deleteMany({});
//     console.log('Cleared existing data');

//     // Seed Users
//     const users = await User.insertMany([
//       { name: 'Alice', email: 'alice@example.com', role: 'member' },
//       { name: 'Bob', email: 'bob@example.com', role: 'admin' },
//       { name: 'Charlie', email: 'charlie@example.com', role: 'member' },
//     ]);

//     console.log('Seeded Users:', users);

//     // Seed Projects
//     const projects = await Project.insertMany([
//       { name: 'Website Redesign', description: 'Redesign our company website.' },
//       { name: 'Mobile App Development', description: 'Develop a new mobile app.' },
//     ]);

//     console.log('Seeded Projects:', projects);

//     // Seed Stages and link to Projects
//     const stages = await Stage.insertMany([
//       { name: 'To Do', projectId: projects[0]._id, taskIds: [] },
//       { name: 'In Progress', projectId: projects[0]._id, taskIds: [] },
//       { name: 'Done', projectId: projects[0]._id, taskIds: [] },
//       { name: 'To Do', projectId: projects[1]._id, taskIds: [] },
//       { name: 'In Progress', projectId: projects[1]._id, taskIds: [] },
//       { name: 'Done', projectId: projects[1]._id, taskIds: [] },
//     ]);

//     console.log('Seeded Stages:', stages);

//     // Link stages to their projects
//     projects[0].stages.push(stages[0]._id, stages[1]._id, stages[2]._id);
//     projects[1].stages.push(stages[3]._id, stages[4]._id, stages[5]._id);
//     await projects[0].save();
//     await projects[1].save();

//     // Seed Tasks and link to Stages and Users
//     const tasks = await Task.insertMany([
//       { title: 'Create Wireframes', description: 'Design wireframes for the new website layout.', stageId: stages[0]._id, dueDate: new Date('2023-12-01'), assignedUser: users[0]._id },
//       { title: 'Develop Landing Page', description: 'Create the landing page for the new site.', stageId: stages[1]._id, dueDate: new Date('2023-12-05'), assignedUser: users[1]._id },
//       { title: 'User Testing', description: 'Conduct user testing for the app.', stageId: stages[3]._id, dueDate: new Date('2023-12-10'), assignedUser: users[2]._id },
//     ]);

//     console.log('Seeded Tasks:', tasks);

//     // Link tasks to their respective stages
//     stages[0].taskIds.push(tasks[0]._id);
//     stages[1].taskIds.push(tasks[1]._id);
//     stages[3].taskIds.push(tasks[2]._id);
//     await stages[0].save();
//     await stages[1].save();
//     await stages[3].save();

//     console.log('Database seeding completed!');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// });

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/profile", profileRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")));
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
