# 1. Track task completion with a `done` boolean

- **Status:** Accepted
- **Date:** 2026-10-20

## Context

A task is either active or done. We considered two ways to model that:

```ts
type Task = { id: string; title: string; done: boolean };
// or
type TaskStatus = "active" | "done";
type Task = { id: string; title: string; status: TaskStatus };
```

A `status` field reads naturally next to the filter (`Filter = "all" | TaskStatus`), and adding a third state later (for example `"in-progress"` or `"archived"`) would only mean adding a value to the union.

## Decision

Use `done: boolean`.

The app has exactly two task states and none planned. A boolean matches the checkbox in the UI, and toggling is `done: !task.done`.

## Consequences

- Toggling and rendering stay as simple as possible.
- The filter maps to `done`: `"active"` shows `!done` tasks and `"done"` shows `done` tasks.
- `Task` is part of the contract shared by all four apps, so every app uses `done: boolean`.
- If a third task state is ever needed, replace `done` with `status` in all four apps and record that in a new ADR.
