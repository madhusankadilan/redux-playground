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
 * The theme is set as `data-theme` on `<html>`, outside `document.body`, so it is removed
 * separately. Otherwise a test that switches to dark would leave the next test in dark mode.
 *
 * Apps 1–3 get the `document.body` cleanup from `@testing-library/react`, which registers
 * its own `cleanup()` in a global `afterEach` (one reason `globals: true` is set in
 * `vite.config.ts`), but they still need to remove `data-theme` themselves. App 0 renders
 * without React, so it has to clean up both by itself.
 *
 * @see ./renderApp.ts
 */
afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute("data-theme");
});
