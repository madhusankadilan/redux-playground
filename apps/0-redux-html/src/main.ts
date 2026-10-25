import "@fontsource-variable/inter";
import "./style.css";
import { mountApp } from "./app";
import { makeStore } from "./store";

mountApp(document.querySelector<HTMLDivElement>("#app")!, makeStore());
