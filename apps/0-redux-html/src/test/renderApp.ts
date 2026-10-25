import { mountApp } from "../app";
import { makeStore } from "../store";

/**
 * Mounts a fresh app with its own store, for a component test.
 *
 * This is the only test file that differs between the four apps. The component tests call
 * `renderApp()` and then use `screen` and `userEvent`, so they are copied unchanged to
 * apps 1–3, where this file renders `<App />` inside `<Provider store={makeStore()}>`.
 *
 * The container is removed after each test by the `afterEach` in `./setup.ts`.
 */
export function renderApp() {
  const container = document.createElement("div");
  document.body.append(container);
  mountApp(container, makeStore());
}
