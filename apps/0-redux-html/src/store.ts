import { combineReducers, legacy_createStore as createStore } from "redux";
import { tasksReducer } from "./features/tasks/tasksReducer";

const rootReducer = combineReducers({ tasks: tasksReducer });

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore() {
  return createStore(rootReducer);
}

export type AppStore = ReturnType<typeof makeStore>;
