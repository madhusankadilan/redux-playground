import { taskAdded } from "./features/tasks/taskActions";
import { makeStore } from "./store";
import type { Task } from "./types";

describe("makeStore", () => {
  test("starts with an empty task list", () => {
    expect(makeStore().getState()).toEqual({ tasks: [] });
  });

  test("dispatching taskAdded adds the task to the state", () => {
    const store = makeStore();
    store.dispatch(taskAdded("Write tests"));

    expect(store.getState().tasks).toEqual([
      { id: expect.any(String), title: "Write tests", done: false },
    ]);
  });

  test("calls subscribers after each dispatch", () => {
    const store = makeStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.dispatch(taskAdded("Write tests"));

    expect(listener).toHaveBeenCalledOnce();
  });

  test("returns a fresh store on every call", () => {
    makeStore().dispatch(taskAdded("Write tests"));

    expect(makeStore().getState().tasks).toEqual([]);
  });

  test("starts with the preloaded tasks", () => {
    const buyMilk: Task = { id: "1", title: "Buy milk", done: false };

    expect(makeStore({ tasks: [buyMilk] }).getState()).toEqual({ tasks: [buyMilk] });
  });

  test("starts with an empty task list when the preloaded tasks are undefined", () => {
    expect(makeStore({ tasks: undefined }).getState()).toEqual({ tasks: [] });
  });
});
