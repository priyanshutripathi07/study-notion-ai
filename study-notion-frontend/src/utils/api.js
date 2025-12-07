const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

async function request(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Unknown error" };
  }

  // error wali condition
  if (!res.ok) {
    // data me agar error ya message hai to use hi bhejenge
    throw {
      status: res.status,
      ...(typeof data === "object" ? data : { message: String(data) }),
    };
  }

  return data;
}

export function signup(body) {
  return request("/signup", { method: "POST", body: JSON.stringify(body) });
}

export function login(body) {
  return request("/login", { method: "POST", body: JSON.stringify(body) });
}

export function aiChat(body) {
  return request("/ask-ai", { method: "POST", body: JSON.stringify(body) });
}

export function aiQuiz(body) {
  return request("/quiz", { method: "POST", body: JSON.stringify(body) });
}

export function aiSummarize(body) {
  return request("/summarize", { method: "POST", body: JSON.stringify(body) });
}

export function getHistory(userId) {
  return request(`/history/${userId}`);
}
