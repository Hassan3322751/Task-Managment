const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const projectsRoutes = require("./routes/projectsRoutes");
const stageRoutes = require("./routes/stageRoutes");
const tasksRoutes = require("./routes/tasksRoutes");

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
}));

const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, err => {
  if (err) throw err;
  console.log("Mongodb connected...");
});

app.get('/', (req, res) => {
  res.status(200).send('Api Working Fine')
})

app.use("/api/projects", projectsRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/tasks", tasksRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
