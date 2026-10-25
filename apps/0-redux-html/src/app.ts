import { taskAdded } from "./features/tasks/taskActions";
import { themeToggled } from "./features/theme/themeActions";
import type { AppStore, RootState } from "./store";
import type { Task } from "./types";

/**
 * Builds the app inside `container` and keeps it in sync with `store`.
 *
 * The shell (header, form) is built once. Only the parts that depend on state (the theme and
 * the task list) are updated on every store change, so the input keeps its text and focus.
 */
export function mountApp(container: HTMLElement, store: AppStore) {
  // 1. The shell: built once, never re-rendered
  container.innerHTML = `
    <main class="card">
      <header class="header">
        <h1>Tasks</h1>
        <button type="button" class="theme-toggle" aria-label="Dark theme" aria-pressed="false">
          <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
          </svg>
          <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </button>
      </header>
      <form class="add-task">
        <input aria-label="New task" placeholder="What needs doing?" autocomplete="off" />
        <button type="submit" disabled>Add</button>
      </form>
      <div class="tasks"></div>
    </main>
  `;

  const form = container.querySelector("form")!;
  const input = form.querySelector("input")!;
  const addButton = form.querySelector("button")!;
  const tasks = container.querySelector<HTMLDivElement>(".tasks")!;
  const themeToggle = container.querySelector<HTMLButtonElement>(".theme-toggle")!;

  // 2. UI-only state: the input's text stays in the DOM, not in Redux
  function updateAddButton() {
    addButton.disabled = input.value.trim() === "";
  }
  input.addEventListener("input", updateAddButton);

  // 3. User event → dispatch an action (no direct DOM update of the list here)
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    store.dispatch(taskAdded(input.value));
    input.value = "";
    updateAddButton();
  });
  themeToggle.addEventListener("click", () => store.dispatch(themeToggled()));

  // 4. State → DOM
  function render(state: RootState) {
    document.documentElement.dataset.theme = state.theme;
    themeToggle.setAttribute("aria-pressed", String(state.theme === "dark"));
    tasks.replaceChildren(state.tasks.length === 0 ? emptyMessage() : taskList(state.tasks));
  }

  store.subscribe(() => render(store.getState()));
  render(store.getState());
}

function taskList(tasks: Task[]) {
  const list = document.createElement("ul");
  list.append(...tasks.map(taskItem));
  return list;
}

function taskItem(task: Task) {
  const item = document.createElement("li");
  item.textContent = task.title;
  return item;
}

function emptyMessage() {
  const message = document.createElement("p");
  message.textContent = "No tasks yet";
  return message;
}
