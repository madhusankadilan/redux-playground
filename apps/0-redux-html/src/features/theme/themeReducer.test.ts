import { themeToggled } from "./themeActions";
import { themeReducer } from "./themeReducer";

describe("themeReducer", () => {
  test("starts with the light theme", () => {
    // Simulates the store starting up: Redux calls every reducer with `undefined` state and an
    // init action. "@@INIT" is just any type the reducer doesn't handle; it isn't a keyword or
    // a value Redux expects (the real init type is "@@redux/INIT" plus random characters).
    expect(themeReducer(undefined, { type: "@@INIT" })).toBe("light");
  });

  test("themeToggled switches light to dark", () => {
    expect(themeReducer("light", themeToggled())).toBe("dark");
  });

  test("themeToggled switches dark to light", () => {
    expect(themeReducer("dark", themeToggled())).toBe("light");
  });
});
