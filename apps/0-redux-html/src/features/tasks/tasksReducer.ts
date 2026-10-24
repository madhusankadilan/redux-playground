import type { Task } from "../../types";
import { TASK_ADDED, type TaskAction } from "./taskActions";

const initialState: Task[] = [];

export function tasksReducer(state: Task[] = initialState, action: TaskAction): Task[] {
  switch (action.type) {
    case TASK_ADDED:
      if (action.payload.title === "") return state;
      return [...state, { ...action.payload, done: false }];
    default:
      return state;
  }
}
