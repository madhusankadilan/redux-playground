import "@fontsource-variable/inter";
import "./style.css";
import { mountApp } from "./app";
import { loadTasks, loadTheme, persistTasks, persistTheme } from "./storage";
import { makeStore } from "./store";

const store = makeStore({ tasks: loadTasks(), theme: loadTheme() });
persistTasks(store);
persistTheme(store);
mountApp(document.querySelector<HTMLDivElement>("#app")!, store);
