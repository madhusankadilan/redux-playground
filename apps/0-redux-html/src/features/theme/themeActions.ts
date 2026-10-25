export const THEME_TOGGLED = "theme/themeToggled";

export type ThemeToggledAction = { type: typeof THEME_TOGGLED };

export type ThemeAction = ThemeToggledAction;

export function themeToggled(): ThemeToggledAction {
  return { type: THEME_TOGGLED };
}
