export const TASK_ADDED = "tasks/taskAdded";
export const TASK_TOGGLED = "tasks/taskToggled";
export const TASK_DELETED = "tasks/taskDeleted";

export type TaskAddedAction = {
  type: typeof TASK_ADDED;
  payload: { id: string; title: string };
};

export type TaskToggledAction = {
  type: typeof TASK_TOGGLED;
  payload: string; // the task's id
};

export type TaskDeletedAction = {
  type: typeof TASK_DELETED;
  payload: string; // the task's id
};

export type TaskAction = TaskAddedAction | TaskToggledAction | TaskDeletedAction;

export function taskAdded(title: string): TaskAddedAction {
  return {
    type: TASK_ADDED,
    payload: { id: crypto.randomUUID(), title: title.trim() },
  };
}

export function taskToggled(id: string): TaskToggledAction {
  return { type: TASK_TOGGLED, payload: id };
}

export function taskDeleted(id: string): TaskDeletedAction {
  return { type: TASK_DELETED, payload: id };
}
