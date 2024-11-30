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
  origin: ['http://localhost:5173', 'https://task-managment-ten-kappa.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, err => {
  if (err) throw err;
  console.log("Mongodb connected...");
});

app.get('/', () => {
  res.send({Status: 'Api working Fine'})
})

app.use("/api/projects", projectsRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/tasks", tasksRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")));
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
