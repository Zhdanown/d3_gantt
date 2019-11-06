import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AuthStatus from "../container/AuthStatus";
import Dropdown from "../shared/Dropdown";

const Navbar = ({ selectedPlanType, ...props }) => {
  if (props.selectedPeriod) {
    const { start, end } = props.selectedPeriod;
    var selectedPeriod = start + " - " + end;
  }

  return (
    <React.Fragment>
      <nav style={{ minHeight: "4.2rem" }}>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">
            {selectedPlanType ? selectedPlanType : null}
            {/* {selectedPeriod} */}
          </Link>

          <ul className="right">
            {/* *********************** */}
            <li>
              <Link to="/tech">
                <i className="material-icons left">account_circle</i>Техника
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
    selectedPeriod:
      state.plan.plans.length && state.plan.plans[0].selectedPeriod,
    selectedPlanType:
      state.plan.plans.length && state.plan.plans[0].seasonPlanType.name,
    planFethced: state.plan.plans.length
  };
};

export default connect(mapStateToProps)(Navbar);
