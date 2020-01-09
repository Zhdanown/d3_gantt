import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Navbar from "../shared/Navbar";
import AuthStatus from "../shared/AuthStatus";
import Dropdown from "../shared/Dropdown";
import { stringToDate, dateToString } from "../../utils/dateHelper";

const NavbarSeasonPlan = ({ selectedSeason, updated, version, ...props }) => {
  const lastUpdated = updated
    ? dateToString(stringToDate(updated), "dd.mm.yyyy")
    : null;

  return (
    <Navbar>
      <span className="updated">
        {lastUpdated && "Обновлено " + lastUpdated}{" "}
      </span>
      <Link to="/sp" className="brand-logo">
        {selectedSeason ? selectedSeason.name + " версия " + version : null}
      </Link>
      <ul className="right">
        {/* *********************** */}
        <li>
          <Link to="/sp/tech">
            <i className="material-icons left">build</i>Техника
          </Link>
        </li>
        {props.planFethced ? (
          <li>
            <Link to="/sp/filter">
              <i className="material-icons left">filter_list</i>Фильтры
            </Link>
          </li>
        ) : null}

        <li>
          <Dropdown
            caption={
              <React.Fragment>
                <i className="material-icons left">assessment</i> Отчеты
              </React.Fragment>
            }
          >
            <li>
              <Link to="/sp/deviation_report">Реестр отклонений</Link>
              <Link to="/sp/deficit_report">Дефицит техники</Link>
              <Link to="/sp/proficit_report">Профицит техники</Link>
              <Link to="/sp/migration_report">Перемещения техники</Link>
              <Link to="/sp/techmap_changes_report">Изменения техкарты</Link>
              <Link to="/sp/logs_report">Логи</Link>
            </li>
          </Dropdown>
        </li>

        <li>
          <Dropdown
            caption={
              <React.Fragment>
                <i className="material-icons left">assignment</i> Планы
              </React.Fragment>
            }
          >
            <li>
              <Link to="/sp/load_plan">Загрузить план</Link>
            </li>
            <li className="divider" tabIndex="-1"></li>
            {props.isOperationalDirector && (
              <li>
                <Link to="/sp/create_plan">Создать план</Link>{" "}
              </li>
            )}
          </Dropdown>
        </li>

        {/* *********************** */}
        <li>
          <AuthStatus />
        </li>
      </ul>
    </Navbar>
  );
};

const mapStateToProps = state => {
  const opDirId = state.plan.roles.operationalDirectorId;
  const isOpDir =
    !!state.auth.user &&
    !!state.auth.user.userRoles.find(x => x.id === opDirId);

  return {
    selectedSeason:
      state.plan.plans.length && state.plan.plans[0].selectedSeason,
    planFethced: state.plan.plans.length,
    updated: state.plan.plans.length && state.plan.plans[0].updateTechMap,
    version: state.plan.plans.length && state.plan.plans[0].version,
    isOperationalDirector: isOpDir
  };
};

export default connect(mapStateToProps)(NavbarSeasonPlan);
