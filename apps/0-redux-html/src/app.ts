import { filterChanged } from "./features/filter/filterActions";
import { taskAdded, taskDeleted, taskToggled } from "./features/tasks/taskActions";
import { selectTaskCounts, selectVisibleTasks } from "./features/tasks/taskSelectors";
import { themeToggled } from "./features/theme/themeActions";
import type { AppStore, RootState } from "./store";
import type { Filter, Task } from "./types";

/**
 * Builds the app inside `container` and keeps it in sync with `store`.
 *
 * The shell (header, form) is built once. Only the parts that depend on state (the theme, the
 * filter buttons and the task list) are updated on every store change, so the input keeps its
 * text and focus.
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
      <div class="filters" role="group" aria-label="Filter tasks">
        <button type="button" data-filter="all">All <span class="count"></span></button>
        <button type="button" data-filter="active">Active <span class="count"></span></button>
        <button type="button" data-filter="done">Done <span class="count"></span></button>
      </div>
      <div class="tasks"></div>
    </main>
  `;

  const form = container.querySelector("form")!;
  const input = form.querySelector("input")!;
  const addButton = form.querySelector("button")!;
  const filters = container.querySelector<HTMLDivElement>(".filters")!;
  const filterButtons = filters.querySelectorAll<HTMLButtonElement>("button");
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
  filters.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-filter]");
    if (!button) return;
    store.dispatch(filterChanged(button.dataset.filter as Filter));
  });

  // One listener on the list container (event delegation): rows are rebuilt on every render,
  // but `tasks` is built once, so this listener survives
  tasks.addEventListener("change", (event) => {
    const checkbox = event.target as HTMLInputElement;
    store.dispatch(taskToggled(checkbox.closest("li")!.dataset.id!));
  });

  tasks.addEventListener("click", (event) => {
    const deleteButton = (event.target as Element).closest(".delete");
    if (!deleteButton) return;
    store.dispatch(taskDeleted(deleteButton.closest("li")!.dataset.id!));
  });

  // 4. State → DOM
  function render(state: RootState) {
    document.documentElement.dataset.theme = state.theme;
    themeToggle.setAttribute("aria-pressed", String(state.theme === "dark"));

    const counts = selectTaskCounts(state);
    for (const button of filterButtons) {
      const filter = button.dataset.filter as Filter;
      button.setAttribute("aria-pressed", String(filter === state.filter));
      button.querySelector(".count")!.textContent = String(counts[filter]);
    }

    const visible = selectVisibleTasks(state);
    const empty = counts.all === 0 ? "No tasks yet" : `No ${state.filter} tasks`;
    tasks.replaceChildren(visible.length > 0 ? taskList(visible) : emptyMessage(empty));
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
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;

  const title = document.createElement("span");
  title.textContent = task.title;

  const label = document.createElement("label");
  label.append(checkbox, title);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete";
  deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
  deleteButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
  `;

  const item = document.createElement("li");
  item.dataset.id = task.id;
  item.append(label, deleteButton);
  return item;
}

function emptyMessage(text: string) {
  const message = document.createElement("p");
  message.textContent = text;
  return message;
}
