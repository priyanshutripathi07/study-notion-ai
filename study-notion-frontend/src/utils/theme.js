const STORAGE_KEY = "stn_theme";

export function getStoredTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "light" || saved === "dark" ? saved : "dark";
}

export function setStoredTheme(theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  // Optional: set data-theme (future use)
  document.documentElement.dataset.theme = theme;
}
