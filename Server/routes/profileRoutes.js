const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileControllers");

// Routes beginning with /api/profile
router.get("/", getProfile);

module.exports = router;