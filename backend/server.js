require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "College AI Backend is running!"
  });
});

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Demo mode for the first setup.
  // We will connect the AI provider here in the next step.
  const reply =
    `Demo response: You asked "${message}". ` +
    `The backend is working. Next we can connect the AI API and then add your college documents/RAG.`;

  return res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`College AI backend running at http://localhost:${PORT}`);
});
