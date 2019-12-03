import agex from "../../apis/agex";
// import store from "../../store";
import { getSeasonId } from "../../utils/plans";
import {
  LOAD_DEVIATION_REPORT,
  LOAD_DEFICIT_REPORT,
  LOAD_PROFICIT_REPORT,
  LOAD_MIGRATION_REPORT
} from "./types";

export const loadDeviationReport = () => async dispatch => {
  const seasonId = await getSeasonId();

  const response = await agex.get(
    `/seasonplan/tech-map-deviation-report/${seasonId}`
  );

  if (response.status === 200)
    dispatch({
      type: LOAD_DEVIATION_REPORT,
      payload: response.data
    });
};

export const loadDeficitReport = () => async dispatch => {
  const seasonId = await getSeasonId();

  const response = await agex.get(`/seasonplan/difict-report/${seasonId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_DEFICIT_REPORT,
      payload: response.data
    });
};

export const loadProficitReport = () => async dispatch => {
  const seasonId = await getSeasonId();

  const response = await agex.get(`/seasonplan/profit-report/${seasonId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_PROFICIT_REPORT,
      payload: response.data
    });
};

export const loadMigrationReport = () => async dispatch => {
  const seasonId = await getSeasonId();

  const response = await agex.get(`/seasonplan/movement-report/${seasonId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_MIGRATION_REPORT,
      payload: response.data
    });
};
