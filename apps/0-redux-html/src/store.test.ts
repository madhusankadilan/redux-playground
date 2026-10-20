import { legacy_createStore as createStore } from "redux";

// Smoke test: Redux is installed and a store works. Phase 0.2 replaces it with the real reducers.
test("a store updates its state when an action is dispatched", () => {
  const counter = (state = 0, action: { type: string }) =>
    action.type === "incremented" ? state + 1 : state;
  const store = createStore(counter);

  store.dispatch({ type: "incremented" });

  expect(store.getState()).toBe(1);
});
