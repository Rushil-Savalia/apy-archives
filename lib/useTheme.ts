"use client";

import { useSyncExternalStore } from "react";

// Tiny external store so any component (header toggle, chart) shares the dark
// state and re-renders on toggle, without threading context through the tree.
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {}
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  );
}

function getServerSnapshot() {
  return false;
}

export function useIsDark() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
