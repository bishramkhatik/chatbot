const nlp = require("compromise");

const generateTitleFromMessages = (messages) => {
  const botText = messages
    .filter(msg => msg.sender === "bot")
    .map(msg => msg.text)
    .join(" ");

  const doc = nlp(botText);
  const sentences = doc.sentences().out("array");

  if (sentences.length === 0) return "Conversation with Bot";

  const sorted = sentences.sort((a, b) => b.length - a.length);
  const best = sorted[0];

  const words = best.split(" ").slice(0, 10).join(" ");
  return words + (best.split(" ").length > 10 ? "..." : "");
};

module.exports = { generateTitleFromMessages };
