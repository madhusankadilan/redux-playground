import type { UnknownAction } from "redux";
import type { Filter } from "../../types";
import { FILTER_CHANGED, type FilterAction } from "./filterActions";

const initialState: Filter = "all";

export function filterReducer(state: Filter = initialState, action: UnknownAction): Filter {
  // Every action reaches every reducer; only filter actions match a case below.
  const filterAction = action as FilterAction;
  switch (filterAction.type) {
    case FILTER_CHANGED:
      return filterAction.payload;
    default:
      return state;
  }
}
