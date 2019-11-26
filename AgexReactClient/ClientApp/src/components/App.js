import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Router, Route } from "react-router-dom";
import history from "../history";

/** import styles */
import "../styles/css/materialize.css";
import "../styles/css/main.css";
import "../styles/css/season-plan.css";

/** import components */
import Navbar from "./shared/Navbar";
import Gantt from "./container/Gantt";
import LoginForm from "./container/LoginForm";
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

/** import actions */
import { getUserProfile } from "../actions/auth";
import {
  getPlanSeasons,
  getPlanTypes,
  getAgrooperations,
  loadPlan
  // showDeficit
} from "../actions/plans";
import { deleteOperation, setOperationData } from "../actions/operations";
import { addNewPeriod, setPeriodData } from "../actions/periods";
import { getVehicles, getEquipment } from "../actions/machinery";

/** import helpers */
import { loadDefaultPlan } from "../helpers/plans";
import MigrationReport from "./container/reports/MigrationReport";

const formats = {
  DAY: { type: "day", cellWidth: 40 },
  WEEK: { type: "week", cellWidth: 70 }
};

function App({ ...props }) {
  const [timeframe, setTimeFrame] = useState(formats["DAY"]);
  const [deficit, setDeficit] = useState(null);

  useEffect(() => {
    props.getUserProfile();
    props.getPlanSeasons();
    props.getPlanTypes();
    props.getAgrooperations();
    props.getVehicles();
    props.getEquipment();
    // init default plan load
    loadDefaultPlan();
  }, []);

  const addNewOperation = data => {
    props.setOperationData(data);
    history.push("/add_operation");
  };

  const addNewPeriod = data => {
    props.setOperationData(data);
    history.push("add_period");
  };

  const editPeriod = ({ period, operation }) => {
    props.setOperationData(operation);
    props.setPeriodData(period);
    history.push("edit_period");
  };

  // const showDeficit = deficitToShow => {
  //   props.showDeficit(deficitToShow);
  // };

  return (
    <Router history={history}>
      <div className="app season-plan">
        <Navbar />

        <Gantt
          timeframe={timeframe}
          addNewOperation={addNewOperation}
          deleteOperation={props.deleteOperation}
          addNewPeriod={addNewPeriod}
          editPeriod={editPeriod}
          showDeficit={setDeficit}
        />

        <Deficit deficit={deficit} />

        <Route path="/login" component={LoginForm} />
        <Route path="/create_plan" component={CreatePlanForm} />
        <Route path="/load_plan" component={LoadPlanForm} />
        <Route path="/add_operation" component={AddOperationForm} />
        <Route path="/add_period" component={AddPeriodForm} />
        <Route path="/edit_period" component={EditPeriodForm} />
        <Route path="/filter" component={FilterForm} />
        <Route path="/tech" component={MachineryCatalogue} />

        <Route path="/deviation_report" component={DeviationReport} />
        <Route path="/deficit_report" component={DeficitReport} />
        <Route path="/proficit_report" component={ProficitReport} />
        <Route path="/migration_report" component={MigrationReport} />
      </div>
    </Router>
  );
}

const mapStateToProps = store => {
  return {
    plans: store.plan.plans
  };
};

export default connect(mapStateToProps, {
  getUserProfile,
  getPlanSeasons,
  getPlanTypes,
  setOperationData,
  setPeriodData,
  getAgrooperations,
  deleteOperation,
  addNewPeriod,
  getVehicles,
  getEquipment,
  loadPlan
})(App);
