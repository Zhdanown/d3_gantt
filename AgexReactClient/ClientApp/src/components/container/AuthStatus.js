import React, { useEffect } from "react";
import { connect } from "react-redux";
import Dropdown from "../shared/Dropdown";
import { Link } from "react-router-dom";

import { /*login,*/ logout } from "../../actions/auth";

function AuthStatus({ user, ...props }) {
  if (props.isloggedIn)
    return (
      <React.Fragment>
        <Dropdown
          caption={
            user && (
              <React.Fragment>
                <i className="material-icons left">account_circle</i>{" "}
                {user.login}
              </React.Fragment>
            )
          }
        >
          {/* <li>
            <a href="#!" onClick={() => alert("В разработке")}>
              Профиль пользователя
            </a>
          </li> */}
          <li className="divider" tabIndex="-1"></li>
          <li>
            <a href="#!" onClick={props.logout}>
              Выйти
            </a>
          </li>
        </Dropdown>
      </React.Fragment>
    );
  else return <Link to="/login">Войти</Link>;
}

const mapStateToProps = store => {
  return {
    user: store.auth.user,
    isloggedIn: store.auth.isloggedIn
  };
};

export default connect(
  mapStateToProps,
  { /* login,*/ logout }
)(AuthStatus);
