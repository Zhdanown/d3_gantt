import { APPLY_FILTER } from "./types";

export const filter = filterConfig => {
  // set list of crops which was filtered out
  return {
    type: APPLY_FILTER,
    payload: filterConfig
  };
};
