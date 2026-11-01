import type { Filter } from "../../types";

export const FILTER_CHANGED = "filter/filterChanged";

export type FilterChangedAction = {
  type: typeof FILTER_CHANGED;
  payload: Filter;
};

export type FilterAction = FilterChangedAction;

export function filterChanged(filter: Filter): FilterChangedAction {
  return { type: FILTER_CHANGED, payload: filter };
}
