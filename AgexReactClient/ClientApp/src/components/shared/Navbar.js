import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AuthStatus from "../container/AuthStatus";
import Dropdown from "../shared/Dropdown";

const Navbar = ({ selectedSeason, ...props }) => {
  return (
    <React.Fragment>
      <nav style={{ minHeight: "4.2rem" }}>
        <div className="nav-wrapper container">
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
                  <Link to="/">Профицит техники</Link>
                  <Link to="/deficit_report">Дефицит техники</Link>
                  <Link to="/">Перемещения техники</Link>
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
    planFethced: state.plan.plans.length
  };
};

export default connect(mapStateToProps)(Navbar);
