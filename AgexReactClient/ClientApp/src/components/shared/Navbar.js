import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AuthStatus from "../container/AuthStatus";

const Navbar = ({ ...props }) => {
  useEffect(() => {
    let elem = document.querySelector(".dropdown-trigger");
    window.M.Dropdown.init(elem, {
      coverTrigger: false,
      constrainWidth: false
    });
  }, []);
  return (
    <React.Fragment>
      <nav style={{ minHeight: "4.2rem" }}>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">
            Logo
          </Link>
          <ul className="right">
            {/* *********************** */}
            <li>
              <a href="#" className="dropdown-trigger" data-target="dropdown1">
                Планы
                <i className="material-icons right">arrow_drop_down</i>
              </a>
              <ul id="dropdown1" className="dropdown-content">
                {/* <li className="divider"></li> */}
                <li>
                  <Link to="/load_plan">Загрузить план</Link>
                </li>
                <li>
                  <Link to="/create_plan">Создать план</Link>
                </li>
              </ul>
            </li>

            {/* *********************** */}

            <AuthStatus />
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
