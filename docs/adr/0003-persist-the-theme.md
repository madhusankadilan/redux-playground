# 3. Persist the theme

- **Status:** Accepted
- **Date:** 2026-10-25
- **Amends:** [ADR 0002](0002-persist-tasks-in-localstorage.md)

## Context

ADR 0002 persists only the tasks, so the theme goes back to light on every reload. Users expect a theme choice to be remembered.

## Decision

Persist the theme the same way as the tasks, under its own key: `redux-playground/app0/theme/v1`.

- One key per slice, so existing saved tasks are kept, invalid data in one slice doesn't affect the other, and each change writes only its own slice.
- `storage.ts` uses two generic helpers: `load(key, isValid)` reads and validates a value, and `persist(store, key, select)` saves the part of the state `select` picks when it changes. `loadTasks`, `loadTheme`, `persistTasks` and `persistTheme` are built on them.

## Consequences

- The theme survives a reload. The filter is still not persisted.
- Adding another persisted slice takes a key, a type guard and two one-line functions.
- The theme is applied when `main.ts` runs, after the first paint, so a saved dark theme may briefly show the light background on reload. If that flash is noticeable, an inline script in `index.html` can set `data-theme` before the first paint.
