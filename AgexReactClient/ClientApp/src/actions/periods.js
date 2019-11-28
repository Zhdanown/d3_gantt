import agex from "../apis/agex";
import alert from "../utils/Alert";

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
    vehicleModelFarmId: x.vehicleModel.farm.id,
    WorkEquipmentModelId: x.workEquipmentModel ? x.workEquipmentModel.id : null,
    workEquipmentModelFarmId: x.workEquipmentModel
      ? x.workEquipmentModel.farm.id
      : null
  }));

  let bodyRequest = {
    Id: newPeriod.id,
    SeasonPlanOperationId: operationData.id,
    SeasonPlanMachinaries: convertedMachinery,
    SeasonPlanPeriodDays: newPeriod.days
  };

  try {
    var response = await agex.post("/seasonplan/period", bodyRequest);
  } catch (error) {}

  if (response && response.status === 201) {
    const { id, plan } = operationData;

    dispatch({
      type: ADD_PERIOD,
      payload: { newPeriod, operationId: id, planId: plan.id }
    });

    alert.success("Период создан");
  } else {
    // alert.error("something went wrong");
  }
};

export const deletePeriod = ({ operation, period }) => async dispatch => {
  try {
    var response = await agex.delete("seasonplan/period", {
      data: { Id: period.id }
    });
  } catch (error) {}

  if (response && response.status === 200) {
    dispatch({
      type: DELETE_PERIOD,
      payload: { period, planId: operation.plan.id, operationId: operation.id }
    });
    alert.success("Период удален");
  }
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
    vehicleModelFarmId: x.vehicleModel.farm.id,
    WorkEquipmentModelId: x.workEquipmentModel ? x.workEquipmentModel.id : null,
    workEquipmentModelFarmId: x.workEquipmentModel
      ? x.workEquipmentModel.farm.id
      : null
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

  try {
    var response = await agex.put("seasonplan/period", bodyRequest);
  } catch (error) {}

  if (response && response.status === 200) {
    const { id, plan } = operationData;
    dispatch({
      type: EDIT_PERIOD,
      payload: { changedPeriod, planId: plan.id, operationId: id }
    });

    alert.success("Период изменён");
  } else {
    // alert.error(response.statusText);
  }
};

export const setPeriodData = period => ({
  type: SET_PERIOD_DATA,
  payload: period
});
