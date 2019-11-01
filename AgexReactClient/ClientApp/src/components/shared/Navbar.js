import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AuthStatus from "../container/AuthStatus";
import Dropdown from "../shared/Dropdown";

const Navbar = ({ ...props }) => {
  
  if (props.selectedPeriod) {
    const {start, end} = props.selectedPeriod;
    var selectedPeriod = start + " - " + end;
  }
  
  return (
    <React.Fragment>
      <nav style={{ minHeight: "4.2rem" }}>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">
            {selectedPeriod}
          </Link>
          <ul className="right">
            {/* *********************** */}
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
            <li></li>

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
    selectedPeriod: state.plan.plans.length && state.plan.plans[0].selectedPeriod
  }
}

export default connect(mapStateToProps)( Navbar );
