import type { UnknownAction } from "redux";
import type { Task } from "../../types";
import { TASK_ADDED, TASK_TOGGLED, type TaskAction } from "./taskActions";

const initialState: Task[] = [];

export function tasksReducer(state: Task[] = initialState, action: UnknownAction): Task[] {
  // Every action reaches every reducer; only task actions match a case below.
  const taskAction = action as TaskAction;
  switch (taskAction.type) {
    case TASK_ADDED:
      if (taskAction.payload.title === "") return state;
      return [...state, { ...taskAction.payload, done: false }];
    case TASK_TOGGLED:
      return state.map((task) =>
        task.id === taskAction.payload ? { ...task, done: !task.done } : task,
      );
    default:
      return state;
  }
}
