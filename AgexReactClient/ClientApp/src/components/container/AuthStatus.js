import React, { useEffect } from "react";
import { connect } from "react-redux";
import { /*login,*/ logout } from "../../actions/auth";
import { Link } from "react-router-dom";

function AuthStatus({ ...props }) {
  // useEffect(() => {
  //   let elem = $("#auth-trigger");
  //   elem.dropdown({
  //     coverTrigger: false,
  //     constrainWidth: false
  //   });
  // }, []);

  if (props.loggedIn)
    return (
      // <React.Fragment>
      //   <li>
      //     <a
      //       href="#"
      //       className="dropdown-trigger"
      //       id="auth-trigger"
      //       data-target="authDropdown"
      //     >
      //       {props.user && <span>{props.user.login}</span>}
      //       <i className="material-icons right">arrow_drop_down</i>
      //     </a>
      //   </li>

      //   <ul id="authDropdown" className="dropdown-content">
      //     <li>
      //       <a href="#" onClick={props.logout}>
      //         Выйти
      //       </a>
      //     </li>
      //   </ul>
      // </React.Fragment>
      <React.Fragment>
        <li>
          <a href="#" onClick={props.logout}>
            Выйти
          </a>
        </li>
        {props.user && (
          <li>
            <span>{props.user.login}</span>
          </li>
        )}
      </React.Fragment>
    );
  else
    return (
      // <a href="#" onClick={props.login}>
      //   Войти
      // </a>
      <li>
        <Link to="/login">Войти</Link>
      </li>
    );
}

const mapStateToProps = store => {
  return {
    user: store.auth.user,
    loggedIn: store.auth.loggedIn
  };
};

export default connect(
  mapStateToProps,
  { /* login,*/ logout }
)(AuthStatus);
