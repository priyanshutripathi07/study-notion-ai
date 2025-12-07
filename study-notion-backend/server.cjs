/* server.cjs - FINAL (chat + quiz + summarize) using OpenRouter */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory stores (demo)
let USERS = [];
let SESSIONS = {};
let HISTORY = [];

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} - body:`, req.body || {});
  next();
});

// ---------------- SIGNUP ----------------
app.post("/signup", (req, res) => {
  const { firstname="", lastname="", email, password, accountType="student" } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email & password required" });

  const emailL = (email || "").toLowerCase();
  if (USERS.find(u => u.email === emailL)) return res.status(400).json({ error: "User already exists" });

  const user = { id: Date.now().toString(), firstname, lastname, email: emailL, password, accountType };
  USERS.push(user);
  const token = "token-" + user.id;
  SESSIONS[token] = user;
  res.json({ token, user: { id: user.id, email: user.email, firstname, accountType } });
});

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const emailL = (email || "").toLowerCase();
  const user = USERS.find(u => u.email === emailL && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const token = "token-" + user.id;
  SESSIONS[token] = user;
  res.json({ token, user: { id: user.id, email: user.email, firstname: user.firstname } });
});

// ---------------- HISTORY ----------------
app.get("/history/:userId", (req, res) => {
  const userId = req.params.userId;
  const list = HISTORY.filter(h => h.userId === userId).sort((a,b) => b.createdAt - a.createdAt);
  res.json({ history: list });
});

// Helper: call OpenRouter chat completion
async function callOpenRouterChat(prompt, model) {
  const KEY = process.env.OPENROUTER_API_KEY;
  if (!KEY) throw new Error("Missing OPENROUTER_API_KEY");

  const url = "https://openrouter.ai/api/v1/chat/completions";
  const body = {
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    // no timeout here; Node default
  });

  const text = await resp.text();
  let data;
  try { data = JSON.parse(text); } catch(e) { data = text; }

  return { status: resp.status, data };
}

// ---------------- ASK-AI (chat) ----------------
app.post("/ask-ai", async (req, res) => {
  const { question, userId } = req.body || {};
  if (!question) return res.status(400).json({ error: "question is required" });

  const model = process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it";
  try {
    console.log("[AI] Using model:", model, "prompt:", question);
    const { status, data } = await callOpenRouterChat(question, model);
    console.log("[AI Raw Response]:", status, data);

    if (status >= 400 || !data || !data.choices) {
      return res.status(500).json({ error: "AI provider error", detail: data || "no choices" });
    }

    const answer = data.choices[0].message?.content || "No response";
    HISTORY.push({ id: Date.now().toString(), userId: userId || "anon", type: "chat", question, answer, createdAt: Date.now() });
    return res.json({ answer });
  } catch (err) {
    console.error("ask-ai error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "AI request failed", detail: err.message });
  }
});

// ---------------- QUIZ GENERATOR ----------------
app.post("/quiz", async (req, res) => {
  const { topic, num = 4, userId } = req.body || {};
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const model = process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it";
  // Prompt instructing the model to return JSON array of MCQs
  const prompt = `Create ${num} multiple-choice questions about "${topic}" suitable for a student. 
Return EXACTLY JSON array (no extra text) like:
[
  { "q": "Question text?", "options": ["A","B","C","D"], "answer": 1 },
  ...
]
Provide simple options and mark correct option index (0-based).`;

  try {
    console.log("[QUIZ] prompt:", prompt);
    const { status, data } = await callOpenRouterChat(prompt, model);
    console.log("[QUIZ Raw]:", status, data);

    // parse response text if necessary
    let content = "";
    if (data && data.choices && data.choices[0].message) content = data.choices[0].message.content;
    else if (typeof data === "string") content = data;
    else content = JSON.stringify(data);

    // extract first JSON-looking substring
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");
    let parsed = null;
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonText = content.slice(jsonStart, jsonEnd + 1);
      try { parsed = JSON.parse(jsonText); } catch (e) { console.warn("Quiz parse failed", e); }
    }

    if (!parsed) {
      // fallback: return whole content as text
      return res.status(200).json({ raw: content, error: "Could not parse MCQ JSON. See raw." });
    }

    // Save to history
    HISTORY.push({ id: Date.now().toString(), userId: userId || "anon", type: "quiz", topic, result: parsed, createdAt: Date.now() });

    return res.json({ quiz: parsed });

  } catch (err) {
    console.error("quiz error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Quiz generation failed", detail: err.message });
  }
});

// ---------------- SUMMARIZE ----------------
app.post("/summarize", async (req, res) => {
  const { text, userId } = req.body || {};
  if (!text) return res.status(400).json({ error: "text is required" });

  const model = process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it";
  const prompt = `Summarize the following text in simple words, short and bulleted if possible. Return only the summary:\n\n${text}`;

  try {
    const { status, data } = await callOpenRouterChat(prompt, model);
    console.log("[SUM Raw]:", status, data);

    if (status >= 400 || !data || !data.choices) {
      return res.status(500).json({ error: "AI provider error", detail: data || "no choices" });
    }

    const summary = data.choices[0].message?.content || "No response";
    HISTORY.push({ id: Date.now().toString(), userId: userId || "anon", type: "summary", text, summary, createdAt: Date.now() });

    return res.json({ summary });

  } catch (err) {
    console.error("summarize error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "Summarize failed", detail: err.message });
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
console.log("OPENROUTER_KEY_LOADED:", !!process.env.OPENROUTER_API_KEY, "MODEL:", process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it");
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
