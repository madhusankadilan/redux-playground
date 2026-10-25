# CLAUDE.md

Learning repo: the same todo app built four times to learn Redux. Only the state layer and the UI binding change between the apps.

## Structure

npm workspaces (`apps/*`, `packages/*`), Node 24, Vite + TypeScript, Vitest + Testing Library (jsdom).

- `apps/0-redux-html`: Redux with plain HTML + TypeScript, no framework. `store.subscribe` re-renders the DOM by hand
- `apps/1-redux-core`: React + plain Redux (no RTK): constants, action creators, `switch` reducers, `react-redux`, `redux-thunk`, `reselect`
- `apps/2-redux-tool-kit`: React + Redux Toolkit: `createSlice`, `configureStore`, typed hooks, `createAsyncThunk`, `createEntityAdapter`
- `apps/3-redux-from-scratch`: app 1's code, importing from `packages/redux-from-scratch` instead of `redux` / `react-redux`
- `packages/redux-from-scratch` (npm name `@playground/redux-from-scratch`): my own `createStore`, `combineReducers`, `applyMiddleware`, thunk, `Provider`, `useSelector`, `useDispatch` (with tests)
- `NOTES.md`: what I learned per phase, plus interview questions

## The feature (identical in all four apps)

```ts
type Task = { id: string; title: string; done: boolean };
type Filter = "all" | "active" | "done";
type Theme = "light" | "dark";
```

- Add a task: input + "Add" button, Enter also adds. Title trimmed, blank ignored, input clears after adding
- Delete a task: "Delete" button per task
- Toggle done: checkbox per task
- Filter: All / Active / Done buttons, each with a count
- Theme: a toggle button in the header switches light / dark
- Persist tasks and the theme: saved to localStorage and restored on page load
- Load tasks (async): fake API (`setTimeout`, ~500 ms) with loading and error states, and a Retry button on error

The UI design is in the Penpot file "Redux Playground": one board per state (Default, Typing, Filter Active, Loading, Error, Empty), in light and dark.

## Shared test contract

Component tests are written in app 0 and copied unchanged to apps 1, 2 and 3. They use Testing Library queries (`screen`, `userEvent`), which work with and without React. Every app exposes:

- `src/store.ts` exports `makeStore()`: a fresh store per test, never a shared singleton
- `src/api.ts` exports `fetchTasks()`: tests replace it with `vi.mock`, so they never wait on real timers and can test the error path
- `src/test/renderApp.ts(x)` exports `renderApp()`: the only per-app difference. App 0 calls `mountApp(container, makeStore())`; apps 1–3 render `<App />` inside `<Provider store={makeStore()}>`
- Tests interact through the UI only, never through the state shape (app 1.6 normalises state, app 2 uses an entity adapter)

## Phases

- App 0 (no framework): 0.1 concepts, 0.2 actions and reducers, 0.3 store, 0.4 rendering the DOM from `subscribe`, 0.5 async (thunk)
- App 1 follows Redux Fundamentals: 1.1 concepts, 1.2 actions and reducers, 1.3 store, 1.4 React (hooks, then one component with `connect`), 1.5 async (thunk), 1.6 patterns (reselect, normalised state)
- App 2: 2.1 convert to RTK, 2.2 `createAsyncThunk`, 2.3 `createSelector` + `createEntityAdapter`, 2.4 compare (tests pass unchanged, file mapping + line counts in NOTES.md)
- App 3: 3.1 `createStore`, 3.2 `combineReducers`, 3.3 `applyMiddleware` + thunk, 3.4 React bindings (`useSyncExternalStore`), 3.5 swap (tests pass unchanged)

## Gotchas

- Plain Redux: `import { legacy_createStore as createStore } from "redux"`
- redux-thunk v3 has no default export: `import { thunk } from "redux-thunk"`
- Generate task ids in action creators (`crypto.randomUUID()`), never in reducers: reducers stay pure
- Short names like `my-redux` are taken on the public npm registry, so the package uses the scoped name `@playground/redux-from-scratch` (app 3 depends on it as `"*"`); `node_modules/@playground/redux-from-scratch` must be a symlink to the workspace
- `@playground/redux-from-scratch` lists `react` as a peer dependency, so there is only one copy of React

## How we work

- I give the plan for each phase. Review it as a senior engineer, then we build step by step.
- One file at a time: show the change and wait for my approval before the next file.
- I'm here to learn: explain what each piece does and why, and keep code simple.
- Tests first for reducers, store and redux-from-scratch; component tests are the same in all four apps.
- Show every shell command you run, in a "Commands run" section.
- `main` is protected: no direct pushes. Work on a branch, open a PR, and merge with rebase.
- Rebase merging puts every commit of the PR on `main` separately, so each commit is small, self-contained and meaningful: one logical change, and the app builds and tests pass at that commit.
- Commits are GPG-signed locally, but GitHub's rebase merge re-creates them unsigned on `main`. That is a deliberate choice (linear, granular history over Verified badges), so signed commits are not required on `main`.
- Commit only after I approve the exact message and file list. Stage files by name.
- Never commit secrets or personal data. The GitHub repo is public.
- Design decisions are recorded in `docs/adr/`. Read them before changing a decision; record new ones as a new numbered ADR.
- After each phase: help me write the NOTES.md entry, then ask me 3 interview questions about it.
