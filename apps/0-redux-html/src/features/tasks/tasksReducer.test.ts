import type { Task } from "../../types";
import { taskAdded, taskDeleted, taskToggled } from "./taskActions";
import { tasksReducer } from "./tasksReducer";

const buyMilk: Task = { id: "1", title: "Buy milk", done: false };

describe("taskAdded", () => {
  test("the action creator trims the title and gives the task a unique id", () => {
    const first = taskAdded("  Write tests  ");
    const second = taskAdded("Write tests");

    expect(first.payload.title).toBe("Write tests");
    expect(first.payload.id).not.toBe(second.payload.id);
  });

  test("adds a task that is not done to the end of the list", () => {
    const action = taskAdded("Write tests");
    const state = tasksReducer([buyMilk], action);

    expect(state).toEqual([buyMilk, { id: action.payload.id, title: "Write tests", done: false }]);
  });

  test("ignores a blank title", () => {
    const before = [buyMilk];

    expect(tasksReducer(before, taskAdded("   "))).toBe(before);
  });
});

describe("taskToggled", () => {
  const readDocs: Task = { id: "2", title: "Read Redux docs", done: true };

  test("marks a task that is not done as done", () => {
    expect(tasksReducer([buyMilk], taskToggled("1"))).toEqual([{ ...buyMilk, done: true }]);
  });

  test("marks a done task as not done", () => {
    expect(tasksReducer([readDocs], taskToggled("2"))).toEqual([{ ...readDocs, done: false }]);
  });

  test("replaces only the toggled task and never mutates it", () => {
    const state = tasksReducer([buyMilk, readDocs], taskToggled("2"));

    expect(state[0]).toBe(buyMilk); // untouched task: same object
    expect(state[1]).not.toBe(readDocs); // toggled task: new object
    expect(readDocs.done).toBe(true); // the old object is unchanged
  });
});

describe("taskDeleted", () => {
  const writeTests: Task = { id: "2", title: "Write tests", done: false };

  test("removes the task with the given id", () => {
    expect(tasksReducer([buyMilk, writeTests], taskDeleted("1"))).toEqual([writeTests]);
  });

  test("keeps the other tasks as the same objects", () => {
    const state = tasksReducer([buyMilk, writeTests], taskDeleted("1"));

    expect(state[0]).toBe(writeTests);
  });

  test("does not mutate the old state", () => {
    const before = [buyMilk, writeTests];
    tasksReducer(before, taskDeleted("1"));

    expect(before).toEqual([buyMilk, writeTests]);
  });
});
