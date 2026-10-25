import type { UnknownAction } from "redux";
import type { Theme } from "../../types";
import { THEME_TOGGLED, type ThemeAction } from "./themeActions";

const initialState: Theme = "light";

export function themeReducer(state: Theme = initialState, action: UnknownAction): Theme {
  // Every action reaches every reducer; only theme actions match a case below.
  const themeAction = action as ThemeAction;
  switch (themeAction.type) {
    case THEME_TOGGLED:
      return state === "light" ? "dark" : "light";
    default:
      return state;
  }
}
