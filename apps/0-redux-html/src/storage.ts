import type { AppStore } from "./store";
import type { Task } from "./types";

/** Per app and versioned: all four apps run on localhost:5173 and share its storage. */
export const STORAGE_KEY = "redux-playground/app0/tasks/v1";

/** Returns the saved tasks, or `undefined` when there are none or they can't be read. */
export function loadTasks(): Task[] | undefined {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return undefined;
    const tasks: unknown = JSON.parse(saved);
    return isTaskList(tasks) ? tasks : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Saves the tasks to localStorage whenever they change. Returns the unsubscribe function.
 *
 * A store can have any number of listeners: `store.subscribe` adds one to a list, and every
 * dispatch calls them all. This one only saves; `mountApp` adds its own to render. They don't
 * know about each other, so saving and rendering stay separate.
 */
export function persistTasks(store: AppStore) {
  // The last tasks array we saved. The listener below keeps it between calls (a closure).
  let saved = store.getState().tasks;

  return store.subscribe(() => {
    const { tasks } = store.getState();
    if (tasks === saved) return;
    saved = tasks;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Saving is best effort: the app keeps working without storage.
    }
  });
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
