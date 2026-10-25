# 2. Persist tasks in localStorage

- **Status:** Accepted, amended by [ADR 0003](0003-persist-the-theme.md)
- **Date:** 2026-10-25

## Context

Tasks live only in the Redux store, so a page refresh loses them. We want them to survive a reload without a backend.

Reading and writing `localStorage` is a side effect, so it can't go in a reducer. The component tests also need a fresh, empty store in every test (`makeStore()`), and jsdom's `localStorage` lasts for a whole test file, so anything that reads or writes storage inside `makeStore()` or `mountApp()` would leak tasks between tests.

## Decision

Persist the `tasks` slice in `localStorage`, around the store rather than inside it:

- **Load once at startup:** `loadTasks()` reads and validates the saved tasks, and `main.ts` passes them as preloaded state: `makeStore({ tasks: loadTasks() })`.
- **Save on change:** `persistTasks(store)` subscribes to the store and writes the tasks only when `state.tasks` is a different array from the last one saved.
- **Wire it in `main.ts` only.** `makeStore()` and `mountApp()` don't touch storage, so tests are unaffected.
- **Key per app, with a version:** `redux-playground/app0/tasks/v1`. All four apps run on `localhost:5173` and share its storage.
- **Storage is best effort:** invalid or unreadable data is ignored (the app starts empty), and a failed save is ignored (the app keeps working).

## Consequences

- Tasks survive a page reload; the filter and theme don't (they aren't persisted).
- Reducers stay pure, and the shared test contract doesn't change.
- `makeStore` takes an optional preloaded state, and reducers must accept any action (`UnknownAction`) so that `combineReducers` can type the preloaded state.
- Apps 1–3 persist tasks the same way, each with its own key.
- If the saved format changes, bump the key's version (`v2`) and ignore or migrate the old data.
- Phase 0.5 planned to load tasks from a fake async API. Whether that API stays, and how it relates to `localStorage`, is decided in phase 0.5.
