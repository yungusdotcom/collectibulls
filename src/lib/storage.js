"use client";

const STORAGE_PREFIX = "collectibulls:";
const MAX_VALUE_SIZE = 5 * 1024 * 1024; // 5MB limit

function sanitizeKey(key) {
  // Only allow alphanumeric, hyphens, colons, underscores
  return key.replace(/[^a-zA-Z0-9\-:_]/g, "");
}

export function loadData(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const safeKey = STORAGE_PREFIX + sanitizeKey(key);
    const raw = localStorage.getItem(safeKey);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveData(key, value) {
  if (typeof window === "undefined") return;
  try {
    const safeKey = STORAGE_PREFIX + sanitizeKey(key);
    const serialized = JSON.stringify(value);
    if (serialized.length > MAX_VALUE_SIZE) {
      console.error("Storage value exceeds max size");
      return;
    }
    localStorage.setItem(safeKey, serialized);
  } catch (e) {
    console.error("Storage save error:", e);
  }
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error("Storage clear error:", e);
  }
}
