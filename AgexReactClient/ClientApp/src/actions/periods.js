import agex from "../apis/agex";
import authHeader from "../apis/authHeader";
import alert from "../components/Alert";

import {
  ADD_PERIOD,
  DELETE_PERIOD,
  SET_PERIOD_DATA,
  EDIT_PERIOD
} from "./types";

export const addNewPeriod = ({
  newPeriod,
  operationData
}) => async dispatch => {
  // construct body request

  let convertedMachinery = newPeriod.machinery.map(x => ({
    VehicleModelId: x.vehicleModel.id,
    WorkEquipmentModelId: x.workEquipmentModel ? x.workEquipmentModel.id : null
  }));

  let bodyRequest = {
    Id: newPeriod.id,
    SeasonPlanOperationId: operationData.id,
    SeasonPlanMachinaries: convertedMachinery,
    SeasonPlanPeriodDays: newPeriod.days
  };

  const response = await agex.post("/seasonplan/period", bodyRequest, {
    headers: authHeader()
  });

  if (response.status === 201) {
    const { id, plan } = operationData;

    dispatch({
      type: ADD_PERIOD,
      payload: { newPeriod, operationId: id, planId: plan.id }
    });

    alert.success("Период создан");
  } else {
    alert.error("something went wrong");
  }
};

export const deletePeriod = ({ operation, period }) => async dispatch => {
  const response = await agex.delete("seasonplan/period", {
    data: { Id: period.id },
    headers: authHeader()
  });

  if (response.status === 200) {
    dispatch({
      type: DELETE_PERIOD,
      payload: { period, planId: operation.plan.id, operationId: operation.id }
    });
    alert.success("Период удален");
  }

  console.log(response);
};

export const editPeriod = ({
  changedPeriod,
  operationData
}) => async dispatch => {
  // construct body request

  const periodId = changedPeriod.id;
  const convertedMachinery = changedPeriod.machinery.map(x => ({
    SeasonPlanPeriodId: periodId,
    VehicleModelId: x.vehicleModel.id,
    WorkEquipmentModelId: x.workEquipmentModel ? x.workEquipmentModel.id : null
  }));
  const days = changedPeriod.days.map(x => ({
    ...x,
    SeasonPlanPeriodId: periodId
  }));

  const bodyRequest = {
    Id: periodId,
    SeasonPlanMachinaries: convertedMachinery,
    SeasonPlanPeriodDays: days
  };

  const response = await agex.put("seasonplan/period", bodyRequest, {
    headers: authHeader()
  });

  if (response.status === 200) {
    const { id, plan } = operationData;
    dispatch({
      type: EDIT_PERIOD,
      payload: { changedPeriod, planId: plan.id, operationId: id }
    });

    alert.success("Период изменён");
  } else {
    alert.error("something went wrong");
  }
};

export const setPeriodData = period => ({
  type: SET_PERIOD_DATA,
  payload: period
});
