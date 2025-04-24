const express = require("express");
const router = express.Router();
const { chatWithGPT, saveChatWithTitle } = require("../controllers/chatController");

// Chat with AI
router.post("/ask", chatWithGPT);

// Save chat with title (auto-generated)
router.post("/save", saveChatWithTitle);

module.exports = router;
