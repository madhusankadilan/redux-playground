# 4. Keep the filter in Redux and derive counts and visible tasks with selectors

- **Status:** Accepted
- **Date:** 2026-11-01

## Context

The filter row shows a count per filter (All 3 · Active 2 · Done 1), the header shows how many tasks are left, and the list shows only the tasks that match the chosen filter.

All of these can be worked out from two facts: the tasks and the chosen filter. They could also be stored in the state next to the tasks (`activeCount`, `visibleTasks`), but then every reducer that changes tasks or the filter would have to keep them up to date, and one missed case makes the UI show wrong numbers.

The chosen filter itself could also live outside Redux, in the DOM or a variable in `mountApp`, because only the list uses it.

## Decision

- **The filter is Redux state:** a `filter` slice (`"all" | "active" | "done"`, starting as `"all"`) changed by `filterChanged(filter)`. This follows Redux Fundamentals, keeps every app's state visible in DevTools, and gives apps 1–3 the same slice to rebuild.
- **The state stores only the facts:** the tasks and the filter. Counts and the visible list are derived on every render by selectors in `features/tasks/taskSelectors.ts`: `selectVisibleTasks(state)` and `selectTaskCounts(state)`.
- **Selectors are named `select…`,** as in the Redux docs, `useSelector` and RTK.
- **The filter is not persisted** (ADR 0003): a reload starts on All.

## Consequences

- Counts and the visible list can't get out of sync with the tasks.
- Selectors are plain functions of the state, tested without a store or DOM.
- Callers don't read `state.tasks` directly, so when app 1.5 normalises the tasks, only the selectors change.
- `selectVisibleTasks` and `selectTaskCounts` return a new array or object on each call. That's fine in app 0, where `render` rebuilds the list anyway, but `useSelector` in React re-renders when the result changes identity, so apps 1–2 wrap them with `reselect` / `createSelector` (phases 1.5 and 2.2).
