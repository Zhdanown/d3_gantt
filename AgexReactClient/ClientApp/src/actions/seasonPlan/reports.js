import agex from "../../apis/agex";
// import store from "../../store";
import { getPlanId } from "../../utils/plans";
import {
  LOAD_DEVIATION_REPORT,
  LOAD_DEFICIT_REPORT,
  LOAD_PROFICIT_REPORT,
  LOAD_MIGRATION_REPORT,
  LOAD_TECHMAP_CHANGES_REPORT,
  LOAD_LOGS_REPORT
} from "./types";
import { dateToString, stringToDate } from "../../utils/dateHelper";

export const loadDeviationReport = () => async dispatch => {
  const planId = await getPlanId();
  const response = await agex.get(
    `/seasonplan/tech-map-deviation-report/${planId}`
  );

  if (response.status === 200)
    dispatch({
      type: LOAD_DEVIATION_REPORT,
      payload: response.data
    });
};

export const loadDeficitReport = () => async dispatch => {
  const planId = await getPlanId();
  const response = await agex.get(`/seasonplan/difict-report/${planId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_DEFICIT_REPORT,
      payload: response.data
    });
};

export const loadProficitReport = () => async dispatch => {
  const planId = await getPlanId();
  const response = await agex.get(`/seasonplan/profit-report/${planId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_PROFICIT_REPORT,
      payload: response.data
    });
};

export const loadMigrationReport = () => async dispatch => {
  const planId = await getPlanId();
  const response = await agex.get(`/seasonplan/movement-report/${planId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_MIGRATION_REPORT,
      payload: response.data
    });
};

export const loadTechMapChangesReport = (start, end) => async dispatch => {
  const seasonPlanId = await getPlanId();
  const startDate = dateToString(stringToDate(start), "yyyy-mm-dd");
  const endDate = dateToString(stringToDate(end), "yyyy-mm-dd");
  const response = await agex.get(`/seasonplan/tech-map-changes`, {
    params: {
      seasonPlanId,
      startDate,
      endDate
    }
  });
  if (response.status === 200)
    dispatch({
      type: LOAD_TECHMAP_CHANGES_REPORT,
      payload: response.data
    });
};

export const loadLogsReport = (start, end) => async dispatch => {
  const seasonPlanId = await getPlanId();
  const startDate = dateToString(stringToDate(start), "yyyy-mm-dd");
  const endDate = dateToString(stringToDate(end), "yyyy-mm-dd");

  const response = await agex.get("/seasonplan/logs", {
    params: {
      seasonPlanId,
      startDate,
      endDate
    }
  });

  if (response && response.status === 200)
    dispatch({
      type: LOAD_LOGS_REPORT,
      payload: response.data
    });
};
