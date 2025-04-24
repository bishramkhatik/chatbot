const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect } = require('../moddleWare/authMiddleware');

// GET /api/history -> Fetch all chat history for a logged-in user
router.get('/', protect, async (req, res) => {
  // Safeguard in case req.user is missing or null
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userId = req.user._id;

  try {
    // Find all chats for this user, sorted by newest first
    const chats = await Chat.find({ user: userId }).sort({ createdAt: -1 });

    // Group chats by date (Today, Yesterday, or full date)
    const grouped = {};

    chats.forEach(chat => {
      const date = new Date(chat.createdAt);
      const key = formatDate(date);

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(chat.title); // Assuming chat.title exists
    });

    res.status(200).json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Utility function to group dates into "Today", "Yesterday", or full date string
function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }); // e.g. "April 8, 2025"
}

module.exports = router;
