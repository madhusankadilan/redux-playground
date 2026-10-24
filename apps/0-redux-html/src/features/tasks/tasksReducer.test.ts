import type { Task } from "../../types";
import { taskAdded } from "./taskActions";
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
