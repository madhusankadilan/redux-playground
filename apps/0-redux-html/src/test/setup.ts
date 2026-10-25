import "@testing-library/jest-dom/vitest";

/**
 * Removes the mounted app after each test, so every test starts with an empty page.
 *
 * Why: Vitest runs all tests in a file on the same `document`, and `renderApp()` appends
 * a new app to `document.body` in every test. Without this cleanup, apps from earlier
 * tests stay on the page, and a query such as `screen.getByRole("button", { name: "Add" })`
 * either:
 * - finds several buttons and throws, or
 * - finds a button left over from an earlier test and passes by accident.
 *
 * Apps 1–3 do not need this: `@testing-library/react` registers its own `cleanup()` in a
 * global `afterEach` (one reason `globals: true` is set in `vite.config.ts`). App 0 renders
 * without React, so it has to clean up by itself.
 *
 * @see ./renderApp.ts
 */
afterEach(() => {
  document.body.replaceChildren();
});
