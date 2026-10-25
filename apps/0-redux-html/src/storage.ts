import type { AppStore, RootState } from "./store";
import type { Task, Theme } from "./types";

/** Per app and versioned: all four apps run on localhost:5173 and share its storage. */
export const TASKS_KEY = "redux-playground/app0/tasks/v1";
export const THEME_KEY = "redux-playground/app0/theme/v1";

/** Returns the saved tasks, or `undefined` when there are none or they can't be read. */
export function loadTasks() {
  return load(TASKS_KEY, isTaskList);
}

/** Returns the saved theme, or `undefined` when there is none or it can't be read. */
export function loadTheme() {
  return load(THEME_KEY, isTheme);
}

/** Saves the tasks whenever they change. Returns the unsubscribe function. */
export function persistTasks(store: AppStore) {
  return persist(store, TASKS_KEY, (state) => state.tasks);
}

/** Saves the theme whenever it changes. Returns the unsubscribe function. */
export function persistTheme(store: AppStore) {
  return persist(store, THEME_KEY, (state) => state.theme);
}

/**
 * Reads and parses the value saved under `key`, and returns it only if `isValid` accepts it.
 *
 * Returns `undefined` when nothing is saved, the value isn't valid JSON, `isValid` rejects it
 * (for example data from an older version or edited by hand), or localStorage can't be read
 * (private mode or blocked storage). The store then falls back to the reducer's initial state.
 */
function load<T>(key: string, isValid: (value: unknown) => value is T): T | undefined {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return undefined;
    const value: unknown = JSON.parse(saved);
    return isValid(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Saves the part of the state that `select` picks whenever it changes.
 *
 * A store can have any number of listeners: `store.subscribe` adds one to a list, and every
 * dispatch calls them all. This one only saves; `mountApp` adds its own to render. They don't
 * know about each other, so saving and rendering stay separate.
 */
function persist<T>(store: AppStore, key: string, select: (state: RootState) => T) {
  // The last value we saved. The listener below keeps it between calls (a closure).
  let saved = select(store.getState());

  return store.subscribe(() => {
    const value = select(store.getState());
    if (value === saved) return;
    saved = value;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Saving is best effort: the app keeps working without storage.
    }
  });
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" && typeof task.title === "string" && typeof task.done === "boolean"
  );
}
