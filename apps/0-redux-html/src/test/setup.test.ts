import { screen } from "@testing-library/dom";

// Checks the test environment itself: jsdom, Vitest globals and jest-dom matchers.
test("renders into the jsdom document", () => {
  document.body.innerHTML = "<p>Hello</p>";

  expect(screen.getByText("Hello")).toBeInTheDocument();
});
