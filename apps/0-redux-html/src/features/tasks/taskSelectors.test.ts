import type { RootState } from "../../store";
import type { Filter, Task } from "../../types";
import { selectTaskCounts, selectVisibleTasks } from "./taskSelectors";

const buyMilk: Task = { id: "1", title: "Buy milk", done: false };
const readDocs: Task = { id: "2", title: "Read Redux docs", done: true };
const writeTests: Task = { id: "3", title: "Write tests", done: false };

function stateWith(filter: Filter, tasks: Task[] = [buyMilk, readDocs, writeTests]): RootState {
  return { tasks, theme: "light", filter };
}

describe("selectVisibleTasks", () => {
  test("all shows every task", () => {
    expect(selectVisibleTasks(stateWith("all"))).toEqual([buyMilk, readDocs, writeTests]);
  });

  test("active shows only tasks that are not done", () => {
    expect(selectVisibleTasks(stateWith("active"))).toEqual([buyMilk, writeTests]);
  });

  test("done shows only done tasks", () => {
    expect(selectVisibleTasks(stateWith("done"))).toEqual([readDocs]);
  });
});

describe("selectTaskCounts", () => {
  test("counts all, active and done tasks", () => {
    expect(selectTaskCounts(stateWith("all"))).toEqual({ all: 3, active: 2, done: 1 });
  });

  test("the counts don't depend on the filter", () => {
    expect(selectTaskCounts(stateWith("done"))).toEqual({ all: 3, active: 2, done: 1 });
  });

  test("counts zero when there are no tasks", () => {
    expect(selectTaskCounts(stateWith("all", []))).toEqual({ all: 0, active: 0, done: 0 });
  });
});
