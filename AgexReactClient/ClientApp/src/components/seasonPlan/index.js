import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import history from "../../history";

import NavbarSeasonPlan from "./NavbarSeasonPlan";
import Gantt from "./container/Gantt";
import CreatePlanForm from "./container/CreatePlanForm";
import LoadPlanForm from "./container/LoadPlanForm";
import AddOperationForm from "./container/AddOperationForm";
import AddPeriodForm from "./container/AddPeriodForm";
import EditPeriodForm from "./container/EditPeriodForm";
import Deficit from "./container/Deficit";
import FilterForm from "./container/FilterForm";
import MachineryCatalogue from "./container/MachineryCatalogue/";
import DeviationReport from "./container/reports/DeviationReport";
import DeficitReport from "./container/reports/DeficitReport";
import ProficitReport from "./container/reports/ProficitReport";
import MigrationReport from "./container/reports/MigrationReport";

/** import actions */
// import { getUserProfile } from "../../actions/auth";
import {
  getPlanSeasons,
  getPlanTypes,
  getAgrooperations,
  loadPlan,
  checkUpdates
  // showDeficit
} from "../../actions/seasonPlan/plans";
import {
  deleteOperation,
  setOperationData
} from "../../actions/seasonPlan/operations";
import { addNewPeriod, setPeriodData } from "../../actions/seasonPlan/periods";
import { getVehicles, getEquipment } from "../../actions/seasonPlan/machinery";

/** import utils */
import { loadDefaultPlan, updatePlan, initUpdateChecks } from "../../utils/plans";

const formats = {
  DAY: { type: "day", cellWidth: 40 },
  WEEK: { type: "week", cellWidth: 70 }
};

function SeasonPlan(props) {
  const [timeframe, setTimeFrame] = useState(formats["DAY"]);
  const [deficit, setDeficit] = useState(null);

  useEffect(() => {
    if (!props.isPlans) props.getPlanSeasons();
    if (!props.isPlanTypes) props.getPlanTypes();
    if (!props.isAgroOperations) props.getAgrooperations();
    if (!props.isVehicles) props.getVehicles();
    if (!props.isEquipment) props.getEquipment();
    // init default plan load
    loadDefaultPlan();
    initUpdateChecks();
  }, []);

  const addNewOperation = data => {
    props.setOperationData(data);
    history.push("/sp/add_operation");
  };

  const addNewPeriod = data => {
    props.setOperationData(data);
    history.push("/sp/add_period");
  };

  const editPeriod = ({ period, operation }) => {
    props.setOperationData(operation);
    props.setPeriodData(period);
    history.push("/sp/edit_period");
  };

  return (
    <div className="season-plan">
      <NavbarSeasonPlan />

      <Gantt
        timeframe={timeframe}
        addNewOperation={addNewOperation}
        deleteOperation={props.deleteOperation}
        addNewPeriod={addNewPeriod}
        editPeriod={editPeriod}
        showDeficit={setDeficit}
      />

      <Deficit deficit={deficit} />
      {/* <Updates /> */}

      <Route path="/sp/create_plan" component={CreatePlanForm} />
      <Route path="/sp/load_plan" component={LoadPlanForm} />
      <Route path="/sp/add_operation" component={AddOperationForm} />
      <Route path="/sp/add_period" component={AddPeriodForm} />
      <Route path="/sp/edit_period" component={EditPeriodForm} />
      <Route path="/sp/filter" component={FilterForm} />
      <Route path="/sp/tech" component={MachineryCatalogue} />

      <Route path="/sp/deviation_report" component={DeviationReport} />
      <Route path="/sp/deficit_report" component={DeficitReport} />
      <Route path="/sp/proficit_report" component={ProficitReport} />
      <Route path="/sp/migration_report" component={MigrationReport} />
    </div>
  );
}

const mapStateToProps = store => {
  return {
    isPlans: store.plan.plans.length,
    isPlanTypes: store.plan.types.length,
    isAgroOperations: store.plan.agrooperations.length,
    isVehicles: store.machinery.vehicles.length,
    isEquipment: store.machinery.equipment.length
  };
};

export default connect(mapStateToProps, {
  // getUserProfile,
  getPlanSeasons,
  getPlanTypes,
  setOperationData,
  setPeriodData,
  getAgrooperations,
  deleteOperation,
  addNewPeriod,
  getVehicles,
  getEquipment,
  loadPlan,
  checkUpdates
})(SeasonPlan);
