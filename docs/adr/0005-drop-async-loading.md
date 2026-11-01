# 5. Drop async loading (thunk and the fake API)

- **Status:** Accepted
- **Date:** 2026-11-01
- **Amends:** [ADR 0002](0002-persist-tasks-in-localstorage.md)

## Context

The plan had an async phase in every app (0.5, 1.5, 2.2, 3.3): load tasks from a fake API (`setTimeout`, ~500 ms) with loading and error states and a Retry button, using `redux-thunk` in app 1, `createAsyncThunk` in app 2 and a hand-written thunk middleware in app 3.

ADR 0002 moved persistence to `localStorage`, which is synchronous: the saved tasks are preloaded when the store is created. A fake API would only add a delay so there is something to load asynchronously.

## Decision

No async loading in any app:

- No fake API: no `src/api.ts` / `fetchTasks()` in the shared test contract.
- No loading or error states and no Retry button.
- No `redux-thunk` (app 1), `createAsyncThunk` (app 2) or thunk in `@playground/redux-from-scratch` (app 3).
- Tasks stay preloaded from `localStorage` (ADR 0002).
- `applyMiddleware` stays in `@playground/redux-from-scratch`, tested with a small logging middleware.

## Consequences

- App 0 is complete after phase 0.4.
- Phases are renumbered: app 1 ends at 1.5 (patterns), app 2 at 2.3 (compare); app 3 keeps 3.1–3.5, with 3.3 being `applyMiddleware` only.
- The Loading and Error boards stay in the Penpot file but are not built.
- Async logic (thunks, `createAsyncThunk`, RTK Query) is common in real apps and interviews and is not covered here. Adding it later needs a new ADR.
