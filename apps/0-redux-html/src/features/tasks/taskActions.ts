export const TASK_ADDED = "tasks/taskAdded";
export const TASK_TOGGLED = "tasks/taskToggled";

export type TaskAddedAction = {
  type: typeof TASK_ADDED;
  payload: { id: string; title: string };
};

export type TaskToggledAction = {
  type: typeof TASK_TOGGLED;
  payload: string; // the task's id
};

export type TaskAction = TaskAddedAction | TaskToggledAction;

export function taskAdded(title: string): TaskAddedAction {
  return {
    type: TASK_ADDED,
    payload: { id: crypto.randomUUID(), title: title.trim() },
  };
}

export function taskToggled(id: string): TaskToggledAction {
  return { type: TASK_TOGGLED, payload: id };
}
