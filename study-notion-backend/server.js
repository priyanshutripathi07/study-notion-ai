// server.js  (CommonJS version – perfect for your setup)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Node 18+ already has global fetch – no need to import anything:
const fetch = global.fetch;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------------- TEMP USER STORAGE ----------------------
let USERS = [];
let SESSIONS = {};

// ---------------------- SIGNUP ----------------------
app.post("/signup", (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  if (USERS.find((u) => u.email === email.toLowerCase())) {
    return res.status(400).json({ error: "User already exists" });
  }

  const user = {
    id: Date.now().toString(),
    firstname,
    lastname,
    email: email.toLowerCase(),
    password,
  };

  USERS.push(user);
  const token = "token-" + user.id;
  SESSIONS[token] = user;

  return res.json({ token, user });
});

// ---------------------- LOGIN ----------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find(
    (u) => u.email === (email || "").toLowerCase() && u.password === password
  );

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = "token-" + user.id;
  SESSIONS[token] = user;

  return res.json({ token, user });
});

// ---------------------- OpenAI Helper ----------------------
async function callOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing in .env file");
  }

  const url = "https://api.openai.com/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    }),
  });

  const data = await response.json();

  if (!data.choices) {
    console.log("OpenAI error:", data);
    throw new Error("AI returned error");
  }

  return data.choices[0].message.content;
}

// ---------------------- AI API ----------------------
app.post("/ask-ai", async (req, res) => {
  const question = req.body.question || req.body.prompt;

  if (!question)
    return res.status(400).json({ error: "question is required" });

  try {
    const finalPrompt = `Explain in easy language: ${question}`;
    const answer = await callOpenAI(finalPrompt);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: "AI error: " + err.message });
  }
});

// ---------------------- SERVER START ----------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend is running on port", PORT);
});
