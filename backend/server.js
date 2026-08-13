require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const NVIDIA_BASE_URL = (process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/$/, "");
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || "nvidia/llama-3.3-nemotron-super-49b-v1.5";

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

const knowledgePath = path.join(__dirname, "college-knowledge.json");
let collegeKnowledge = {};
try { collegeKnowledge = JSON.parse(fs.readFileSync(knowledgePath, "utf8")); }
catch (e) { console.error("Could not load college-knowledge.json", e.message); }

const systemPrompt = `You are GECN AI, the official-style student information assistant for Government Engineering College Nawada (GEC Nawada), Bihar.

Your job is to answer questions about GEC Nawada accurately, clearly and helpfully. You are NOT the college administration and you must never claim to issue official approvals, notices, certificates, fee decisions, hostel allotments, attendance permissions, exam decisions, or placement guarantees.

COLLEGE-SPECIFIC RULES:
1. Prefer the supplied GEC Nawada knowledge below for college facts.
2. Never invent a fee amount, deadline, teacher, phone number, seat count, timetable, notice, placement package, hostel rule, or admission rule.
3. If a fact is missing or may have changed, say that it should be verified from the official GEC Nawada website/notice before the student relies on it.
4. For current notices, exams, timetables, fees, admission deadlines and hostel matters, explicitly recommend checking the latest official notice.
5. Answer in the same language/style as the student. Hindi/Hinglish questions should get natural Hindi/Hinglish answers; English questions should get English answers.
6. Be concise by default, but explain step-by-step when the student asks how to do something.
7. If the question is unrelated to GEC Nawada, you can still help with general academic/career questions, but do not pretend they are official college policies.
8. If asked for a direct official source, give the official GEC Nawada website: https://www.gecnawada.org.in/

COLLEGE KNOWLEDGE:
${JSON.stringify(collegeKnowledge, null, 2)}
`;

app.get("/", (req, res) => res.json({
  ok: true,
  message: "GECN College AI Backend is running",
  ai: Boolean(process.env.NVIDIA_API_KEY),
  provider: "NVIDIA NIM",
  model: NVIDIA_MODEL
}));

app.get("/api/health", (req, res) => res.json({
  ok: true,
  ai: Boolean(process.env.NVIDIA_API_KEY),
  provider: "NVIDIA NIM",
  model: NVIDIA_MODEL
}));

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message || "").trim();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  if (!message) return res.status(400).json({ error: "Message is required." });

  const key = process.env.NVIDIA_API_KEY;
  if (!key || key === "your_nvidia_api_key_here") {
    return res.status(503).json({ error: "NVIDIA API key is not configured. Add NVIDIA_API_KEY to backend/.env and restart the backend." });
  }

  const safeHistory = history
    .filter(x => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string")
    .slice(-12);

  const messages = [
    { role: "system", content: systemPrompt },
    ...safeHistory,
    ...(safeHistory.at(-1)?.role === "user" && safeHistory.at(-1)?.content === message
      ? []
      : [{ role: "user", content: message }])
  ];

  try {
    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages,
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: 1024,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("NVIDIA API error:", response.status, data);
      return res.status(response.status).json({
        error: data?.error?.message || data?.detail || "NVIDIA API request failed."
      });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) return res.status(502).json({ error: "NVIDIA returned an empty response." });
    res.json({ reply, provider: "NVIDIA NIM", model: NVIDIA_MODEL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not connect to NVIDIA. Check internet connection, API key and model configuration." });
  }
});

app.listen(PORT, () => console.log(`GECN backend running at http://localhost:${PORT}`));
