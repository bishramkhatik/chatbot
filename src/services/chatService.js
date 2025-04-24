import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// ✅ Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  console.log("🔐 Token from localStorage:", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Send message to GPT (unauthenticated)
export const sendMessageToGPT = async (message) => {
  try {
    const res = await axios.post(`${API_BASE}/chat/ask`, { message });
    return res.data.reply;
  } catch (err) {
    console.error("❌ Error communicating with GPT:", err);
    return "Sorry, I'm having trouble right now.";
  }
};

// ✅ Save chat to database (authenticated)
export const saveChatToDB = async (messages, userId) => {
  try {
    const res = await axios.post(
      `${API_BASE}/chat/save`,
      { messages, userId },
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error saving chat:", err.response || err);
    throw err;
  }
};

// ✅ Fetch chat history (authenticated)
export const fetchChatHistory = async () => {
  const headers = getAuthHeader();
  console.log("📥 Headers for fetchChatHistory:", headers);

  try {
    const res = await axios.get(`${API_BASE}/history`, { headers });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching chat history:", err.response || err);
    return {};
  }
};
