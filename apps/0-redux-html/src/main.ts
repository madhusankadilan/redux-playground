import "@fontsource-variable/inter";
import "./style.css";
import { mountApp } from "./app";
import { loadTasks, persistTasks } from "./storage";
import { makeStore } from "./store";

const store = makeStore({ tasks: loadTasks() });
persistTasks(store);
mountApp(document.querySelector<HTMLDivElement>("#app")!, store);
