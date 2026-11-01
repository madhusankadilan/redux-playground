import type { RootState } from "../../store";
import type { Task } from "../../types";

// Selectors: functions that read or derive a value from the state, `(state) => value`.
// Counts and the visible list are computed here, never stored in the state (ADR 0004).

export type TaskCounts = { all: number; active: number; done: number };

export function selectVisibleTasks(state: RootState): Task[] {
  switch (state.filter) {
    case "active":
      return state.tasks.filter((task) => !task.done);
    case "done":
      return state.tasks.filter((task) => task.done);
    default:
      return state.tasks;
  }
}

export function selectTaskCounts(state: RootState): TaskCounts {
  const done = state.tasks.filter((task) => task.done).length;
  return { all: state.tasks.length, active: state.tasks.length - done, done };
}
