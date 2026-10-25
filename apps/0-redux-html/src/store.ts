import { combineReducers, legacy_createStore as createStore, type StoreEnhancer } from "redux";
import { tasksReducer } from "./features/tasks/tasksReducer";

declare global {
  interface Window {
    // Injected by the Redux DevTools browser extension; undefined when it isn't installed
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
  }
}

const rootReducer = combineReducers({ tasks: tasksReducer });

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return createStore(rootReducer, preloadedState, window.__REDUX_DEVTOOLS_EXTENSION__?.());
}

export type AppStore = ReturnType<typeof makeStore>;
