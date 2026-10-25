import { taskAdded } from "./features/tasks/taskActions";
import type { AppStore, RootState } from "./store";
import type { Task } from "./types";

/**
 * Builds the app inside `container` and keeps it in sync with `store`.
 *
 * The shell (heading, form) is built once. Only the task list is re-rendered, on every
 * store change, so the input keeps its text and focus while the list updates.
 */
export function mountApp(container: HTMLElement, store: AppStore) {
  // 1. The shell: built once, never re-rendered
  container.innerHTML = `
    <main class="card">
      <h1>Tasks</h1>
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

  // 4. State → DOM
  function render(state: RootState) {
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
