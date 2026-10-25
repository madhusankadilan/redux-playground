import { taskAdded } from "./features/tasks/taskActions";
import { loadTasks, persistTasks, STORAGE_KEY } from "./storage";
import { makeStore } from "./store";
import type { Task } from "./types";

const buyMilk: Task = { id: "1", title: "Buy milk", done: false };

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("loadTasks", () => {
  test("returns undefined when nothing is saved", () => {
    expect(loadTasks()).toBeUndefined();
  });

  test("returns the saved tasks", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([buyMilk]));

    expect(loadTasks()).toEqual([buyMilk]);
  });

  test("returns undefined when the saved value is not valid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{oops");

    expect(loadTasks()).toBeUndefined();
  });

  test("returns undefined when the saved value is not a list of tasks", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ title: "No id" }]));

    expect(loadTasks()).toBeUndefined();
  });

  test("returns undefined when localStorage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Access denied");
    });

    expect(loadTasks()).toBeUndefined();
  });
});

describe("persistTasks", () => {
  test("saves the tasks when they change", () => {
    const store = makeStore();
    persistTasks(store);

    store.dispatch(taskAdded("Buy milk"));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(store.getState().tasks);
  });

  test("does not save when the tasks did not change", () => {
    const store = makeStore();
    persistTasks(store);
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    store.dispatch(taskAdded("   "));

    expect(setItem).not.toHaveBeenCalled();
  });

  test("keeps the app working when saving fails", () => {
    const store = makeStore();
    persistTasks(store);
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    expect(() => store.dispatch(taskAdded("Buy milk"))).not.toThrow();
    expect(setItem).toHaveBeenCalledOnce();
    expect(store.getState().tasks).toHaveLength(1);
  });
});
