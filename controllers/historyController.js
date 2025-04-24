// routes/historyRoutes.js

const express = require("express");
const router = express.Router();
const { getChatHistory } = require("../controllers/historyController");
const { protect } = require("../moddleWare/authMiddleware");

// GET /api/history -> Fetch all chat history for a logged-in user
router.get("/", protect, getChatHistory);

module.exports = router;
