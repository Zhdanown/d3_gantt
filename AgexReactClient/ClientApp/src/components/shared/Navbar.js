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
            {selectedPlanType ? selectedPlanType : null} {selectedPeriod}
          </Link>

          <ul className="right">
            {/* *********************** */}
            <li>
              <Link to="/tech">Техника</Link>
            </li>
            <li>
              <Link to="/filter">
                <i className="material-icons">filter_list</i>
              </Link>
            </li>

            <li>
              <Dropdown caption="Планы">
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
      state.plan.plans.length && state.plan.plans[0].seasonPlanType.name
  };
};

export default connect(mapStateToProps)(Navbar);
