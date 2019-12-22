import store from "../store";
import { createRange, stringToDate, dateToString } from "./dateHelper";
import {
  loadPlan,
  checkUpdates,
  setLastUpdatedTime
} from "../actions/seasonPlan/plans";

export async function getSeasonId() {
  const state = store.getState();

  const seasonId = state.plan.plans.length
    ? state.plan.plans[0].selectedSeason.id
    : await new Promise((resolve, reject) => {
        store.subscribe(() => {
          const state = store.getState();
          if (state.plan.plans.length) {
            const { id } = state.plan.plans[0].selectedSeason;
            resolve(id);
          }
        });
      });
  return seasonId;
}

export const updatePlan = async () => {
  const state = store.getState();
  // get current seson
  const currentSeason = state.plan.plans[0].selectedSeason;
  const type = state.plan.types[0];
  if (!currentSeason || !type) return;

  store.dispatch(loadPlan({ season: currentSeason, type }));
};

export const loadDefaultPlan = async () => {
  const currentSeason = await new Promise((resolve, reject) => {
    store.subscribe(() => {
      const state = store.getState();
      if (state.plan.seasons.length) {
        resolve(state.plan.seasons.find(x => x.isCurrent));
      }
    });
  });

  const type = await new Promise((resolve, reject) => {
    store.subscribe(() => {
      const state = store.getState();
      const { types } = state.plan;
      if (types.length) resolve(types[0]);
    });
  });

  store.dispatch(loadPlan({ season: currentSeason, type }));

  const lastUpdated = dateToString(new Date(), "ISO");
  store.dispatch(setLastUpdatedTime(lastUpdated));
};

export const getHierarchy = operations => {
  let tree = { id: "root", name: "root", children: [] };
  operations.forEach(operation => {
    let holding = handleNode(operation.holding, tree.children, operation);
    let farm = handleNode(operation.farm, holding.children, operation);
    let crop = handleNode(operation.crop, farm.children, operation);
    handleNode(operation.agroOperation, crop.children, operation, true);
  });

  function handleNode(node, arr, item, considerTerms = false) {
    let foundNode;
    if (considerTerms) {
      foundNode = arr.find(x => x.id === node.id && x.node.id === item.id);
    } else {
      foundNode = arr.find(x => x.id === node.id);
    }

    if (!foundNode) {
      foundNode = { ...node, children: [], node: item };
      arr.push(foundNode);
    }
    return foundNode;
  }

  return tree;
};

export const getOperationDates = operation => {
  let start = new Date(operation.startDate);
  let end = new Date(operation.endDate);
  let dates = createRange(start, end);
  return dates.map(x => ({ date: stringToDate(x) }));
};

export const evalMachineryQuantity = (evaluatedDay, farmId, machinery) => {
  const state = store.getState();

  const periods = state.plan.plans
    .flatMap(plan => plan.operations)
    .filter(operation => operation.periods.length)
    .flatMap(operation => operation.periods)
    .filter(period => period.days.find(day => day.day === evaluatedDay));

  let vehicleModels = machinery.flatMap(pair => pair.vehicleModel);
  let workEquipmentModels = machinery
    .flatMap(pair => pair.workEquipmentModel)
    .filter(x => x);
  // get unique values of models
  vehicleModels = [
    ...new Set(vehicleModels.map(x => JSON.stringify(x)))
  ].map(x => JSON.parse(x));
  workEquipmentModels = [
    ...new Set(workEquipmentModels.map(x => JSON.stringify(x)))
  ].map(x => JSON.parse(x));

  // count how many times vehicles are used on given day
  vehicleModels = vehicleModels.map(x => ({
    ...x,
    usedQuantity: countUsedModel(x, "vehicleModel")
  }));

  // count how many times vehicles are used on given day
  workEquipmentModels = workEquipmentModels.map(x => ({
    ...x,
    usedQuantity: countUsedModel(x, "workEquipmentModel")
  }));

  function countUsedModel(model, type) {
    if (!model) return 0;
    return periods.reduce((count, period) => {
      period.machinery.forEach(pair => {
        if (
          pair[type] &&
          pair[type].id === model.id &&
          pair[type].farm.id === model.farm.id
        )
          count++;
      });
      return count;
    }, 0);
  }

  /*
   ********** count models balance (farm's quantity - usedQuantity) ********
   */

  vehicleModels = vehicleModels.map(model => {
    const foundModel = state.machinery.vehicles.find(
      x => x.vehicleModel.id === model.id && x.farm.id === model.farm.id
    );
    if (!foundModel) return { ...model, balance: -model.usedQuantity };

    let balance = foundModel.count - model.usedQuantity;
    return {
      ...model,
      balance
    };
  });
  workEquipmentModels = workEquipmentModels.map(model => {
    const foundModel = state.machinery.equipment.find(
      x => x.workEquipmentModel.id === model.id && x.farm.id === model.farm.id
    );
    if (!foundModel) return { ...model, balance: -model.usedQuantity };

    let balance = foundModel.count - model.usedQuantity;
    return {
      ...model,
      balance
    };
  });

  // return deficit
  const deficit = {
    vehicles: vehicleModels.filter(x => x.balance < 0),
    workEquipment: workEquipmentModels.filter(x => x.balance < 0)
  };
  return deficit;
};

export const getSquareRemainder = (operation, periodId = null) => {
  // check if operation is closed (cropSquare <= machinery's sumProductivity)
  let { cropSquare, periods } = operation;
  // exclude given period
  periods = periods.filter(period => period.id !== periodId);

  let sumProductivity = periods.reduce((totalProd, period) => {
    totalProd += period.days.reduce((acc, day) => {
      acc = Math.round((acc + day.productivity) * 10000) / 10000;
      return acc;
    }, 0);
    return totalProd;
  }, 0);
  sumProductivity = Math.floor(sumProductivity * 10000) / 10000;
  let remainder = cropSquare - sumProductivity;

  return remainder;
};

export const sortOperations = operations => {
  return operations.sort((a, b) => {
    const aTime = new Date(a.startDate).getTime();
    const bTime = new Date(b.startDate).getTime();
    // sort by startDate
    if (aTime === bTime) {
      // then sort by holdingName
      if (a.holding.name > b.holding.name) return 1;
      if (a.holding.name < b.holding.name) return -1;
      else {
        // then sort by farm name
        if (a.farm.name > b.farm.name) return 1;
        if (a.farm.name < b.farm.name) return -1;
        else {
          // then sort by culture name
          if (a.crop.name > b.crop.name) return 1;
          if (a.crop.name < b.crop.name) return -1;
          return 0;
        }
      }
    } else return aTime - bTime;
  });
};

export const initUpdateChecks = () => {
  function fetchUpdates() {
    const state = store.getState();
    let { selectedSeason } = state.plan.plans.length
      ? state.plan.plans[0]
      : null;
    let { lastUpdated } = state.spUpdate;
    if (!selectedSeason || !lastUpdated) return;
    store.dispatch(checkUpdates(selectedSeason, lastUpdated));
  }

  setInterval(() => {
    fetchUpdates();
  }, 60 * 1000);
};
