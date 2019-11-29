import React from "react";
// import AuthStatus from "./AuthStatus";
// import Dropdown from "./Dropdown";

const Navbar = ({ selectedSeason, updated, ...props }) => {
  return (
    <React.Fragment>
      <nav style={{ minHeight: "4.2rem" }}>
        <div className="nav-wrapper container">{props.children}</div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
