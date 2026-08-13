require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "GECN College AI Backend is running!",
    ai: Boolean(process.env.OPENROUTER_API_KEY)
  });
});

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message || "").trim();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // The app can still be tested without an API key.
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "your_openrouter_key_here") {
    return res.json({
      reply:
        `Demo mode: "${message}"\n\n` +
        `Backend is working. Add your OpenRouter API key to backend/.env to enable AI responses.`
    });
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          "You are GECN AI, a helpful college assistant for Government Engineering College Nawada. " +
          "Answer clearly and honestly. Do not invent official college facts. " +
          "If official college information is unavailable, say that it should be verified from official college documents."
      },
      ...history
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    // Avoid duplicating the current user message if history already contains it.
    if (messages[messages.length - 1]?.content !== message || messages[messages.length - 1]?.role !== "user") {
      messages.push({ role: "user", content: message });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
        "X-Title": "GECN College AI Chatbot",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free",
        messages,
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(response.status).json({
        error: data?.error?.message || "AI provider request failed."
      });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(502).json({ error: "AI provider returned an empty response." });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      error: "Could not connect to the AI provider. Check your internet connection and API key."
    });
  }
});

app.listen(PORT, () => {
  console.log(`GECN College AI backend running at http://localhost:${PORT}`);
});
