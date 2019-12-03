import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Navbar from "../shared/Navbar";
import AuthStatus from "../shared/AuthStatus";
import Dropdown from "../shared/Dropdown";
import { stringToDate, dateToString } from "../../utils/dateHelper";

const NavbarSeasonPlan = ({ selectedSeason, updated, ...props }) => {
  const lastUpdated = updated
    ? dateToString(stringToDate(updated), "dd.mm.yyyy")
    : null;

  return (
    <Navbar>
      <span className="updated">
        {lastUpdated && "Обновлено " + lastUpdated}{" "}
      </span>
      <Link to="/sp" className="brand-logo">
        {selectedSeason ? selectedSeason.name : null}
      </Link>
      <ul className="right">
        {/* *********************** */}
        <li>
          <Link to="/sp/tech">
            <i className="material-icons left">directions_car</i>Техника
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
                <i className="material-icons left">assignment</i> Отчеты
              </React.Fragment>
            }
          >
            <li>
              <Link to="/sp/deviation_report">Реестр отклонений</Link>
              <Link to="/sp/deficit_report">Дефицит техники</Link>
              <Link to="/sp/proficit_report">Профицит техники</Link>
              <Link to="/sp/migration_report">Перемещения техники</Link>
            </li>
          </Dropdown>
        </li>

        {/* <li>
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
            <li>
              <Link to="/sp/create_plan">Создать план</Link>{" "}
            </li>
          </Dropdown>
        </li> */}

        {/* *********************** */}
        <li>
          <AuthStatus />
        </li>
      </ul>
    </Navbar>
  );

  return (
    <React.Fragment>
      <nav style={{ minHeight: "4.2rem" }}>
        <div className="nav-wrapper container">
          <span className="updated">
            {lastUpdated && "Обновлено " + lastUpdated}{" "}
          </span>
          <Link to="/" className="brand-logo">
            {selectedSeason ? selectedSeason.name : null}
          </Link>

          <ul className="right">
            {/* *********************** */}
            <li>
              <Link to="/tech">
                <i className="material-icons left">directions_car</i>Техника
              </Link>
            </li>
            {props.planFethced ? (
              <li>
                <Link to="/filter">
                  <i className="material-icons left">filter_list</i>Фильтры
                </Link>
              </li>
            ) : null}

            <li>
              <Dropdown
                caption={
                  <React.Fragment>
                    <i className="material-icons left">assignment</i> Отчеты
                  </React.Fragment>
                }
              >
                <li>
                  <Link to="/deviation_report">Реестр отклонений</Link>
                  <Link to="/deficit_report">Дефицит техники</Link>
                  <Link to="/proficit_report">Профицит техники</Link>
                  <Link to="/migration_report">Перемещения техники</Link>
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
                  <Link to="/load_plan">Загрузить план</Link>
                </li>
                <li className="divider" tabIndex="-1"></li>
                <li>
                  <Link to="/create_plan">Создать план</Link>{" "}
                </li>
              </Dropdown>
            </li>

            {/* *********************** */}
            <li>
              <AuthStatus />
            </li>
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    selectedSeason:
      state.plan.plans.length && state.plan.plans[0].selectedSeason,
    planFethced: state.plan.plans.length,
    updated: state.plan.plans.length && state.plan.plans[0].updateTechMap
  };
};

export default connect(mapStateToProps)(NavbarSeasonPlan);
