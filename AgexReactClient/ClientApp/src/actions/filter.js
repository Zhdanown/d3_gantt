import { APPLY_FILTER } from "./types";

export const filterCrops = cropList => {
  // set list of crops which was filtered out
  return {
    type: APPLY_FILTER,
    payload: cropList
  }
}