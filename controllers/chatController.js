const axios = require("axios");
const Chat = require("../models/Chat");
const { generateTitleFromMessages } = require("../utils/chatUtils");

// Handles chatbot conversation
const chatWithGPT = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from OpenRouter." });
  }
};

// Saves a chat with auto-generated title
const saveChatWithTitle = async (req, res) => {
  try {
    const { messages, userId } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required." });
    }

    const title = generateTitleFromMessages(messages);

    const chat = new Chat({
      title,
      messages,
      user: userId,
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { chatWithGPT, saveChatWithTitle };
