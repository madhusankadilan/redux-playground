export const TASK_ADDED = "tasks/taskAdded";

export type TaskAddedAction = {
  type: typeof TASK_ADDED;
  payload: { id: string; title: string };
};

export type TaskAction = TaskAddedAction;

export function taskAdded(title: string): TaskAddedAction {
  return {
    type: TASK_ADDED,
    payload: { id: crypto.randomUUID(), title: title.trim() },
  };
}
