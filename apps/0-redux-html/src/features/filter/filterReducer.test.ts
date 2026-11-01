import { filterChanged } from "./filterActions";
import { filterReducer } from "./filterReducer";

describe("filterReducer", () => {
  test("starts with all tasks shown", () => {
    expect(filterReducer(undefined, { type: "@@INIT" })).toBe("all");
  });

  test("filterChanged sets the filter", () => {
    expect(filterReducer("all", filterChanged("active"))).toBe("active");
    expect(filterReducer("active", filterChanged("done"))).toBe("done");
  });

  test("choosing the current filter again keeps it", () => {
    expect(filterReducer("active", filterChanged("active"))).toBe("active");
  });
});
