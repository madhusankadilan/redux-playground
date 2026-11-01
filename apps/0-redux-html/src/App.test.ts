import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { renderApp } from "./test/renderApp";

const titleInput = () => screen.getByRole("textbox", { name: "New task" });
const addButton = () => screen.getByRole("button", { name: "Add" });
const themeToggle = () => screen.getByRole("button", { name: "Dark theme" });
const checkbox = (title: string) => screen.getByRole("checkbox", { name: title });
const deleteButton = (title: string) => screen.getByRole("button", { name: `Delete ${title}` });

describe("adding tasks", () => {
  test("shows an empty message when there are no tasks", () => {
    renderApp();

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  test("the Add button is disabled until the title has text", async () => {
    const user = userEvent.setup();
    renderApp();

    expect(addButton()).toBeDisabled();
    await user.type(titleInput(), "   ");
    expect(addButton()).toBeDisabled();
    await user.type(titleInput(), "Buy milk");
    expect(addButton()).toBeEnabled();
  });

  test("adds a task when Add is clicked", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk");
    await user.click(addButton());

    expect(screen.getByRole("listitem")).toHaveTextContent("Buy milk");
    expect(screen.queryByText("No tasks yet")).not.toBeInTheDocument();
  });

  test("adds a task when Enter is pressed", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");

    expect(screen.getByRole("listitem")).toHaveTextContent("Buy milk");
  });

  test("does not add a blank task when Enter is pressed", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "   {Enter}");

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  test("clears the input after adding", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");

    expect(titleInput()).toHaveValue("");
    expect(addButton()).toBeDisabled();
  });

  test("shows tasks in the order they were added", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");
    await user.type(titleInput(), "Write tests{Enter}");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Buy milk");
    expect(items[1]).toHaveTextContent("Write tests");
  });
});

describe("marking tasks done", () => {
  test("a new task is not done", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");

    expect(checkbox("Buy milk")).not.toBeChecked();
  });

  test("clicking the checkbox marks the task done", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");
    await user.click(checkbox("Buy milk"));

    expect(checkbox("Buy milk")).toBeChecked();
  });

  test("clicking the checkbox again marks the task not done", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");
    await user.click(checkbox("Buy milk"));
    await user.click(checkbox("Buy milk"));

    expect(checkbox("Buy milk")).not.toBeChecked();
  });

  test("clicking the title also toggles the task", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");
    await user.click(screen.getByText("Buy milk"));

    expect(checkbox("Buy milk")).toBeChecked();
  });

  test("marks only the clicked task done", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");
    await user.type(titleInput(), "Write tests{Enter}");
    await user.click(checkbox("Write tests"));

    expect(checkbox("Buy milk")).not.toBeChecked();
    expect(checkbox("Write tests")).toBeChecked();
  });
});

describe("deleting tasks", () => {
  test("removes the task when its delete button is clicked", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");
    await user.click(deleteButton("Buy milk"));

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  test("removes only the clicked task", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(titleInput(), "Buy milk{Enter}");
    await user.type(titleInput(), "Write tests{Enter}");
    await user.click(deleteButton("Buy milk"));

    expect(screen.getByRole("listitem")).toHaveTextContent("Write tests");
  });
});

describe("theme", () => {
  test("starts with the light theme", () => {
    renderApp();

    expect(themeToggle()).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  test("switches to the dark theme when the toggle is clicked", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(themeToggle());

    expect(themeToggle()).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  test("switches back to the light theme on a second click", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(themeToggle());
    await user.click(themeToggle());

    expect(themeToggle()).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
