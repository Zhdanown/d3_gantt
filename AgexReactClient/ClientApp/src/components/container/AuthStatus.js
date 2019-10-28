import React, { useEffect } from "react";
import { connect } from "react-redux";
import Dropdown from "../shared/Dropdown";
import { Link } from "react-router-dom";

import { /*login,*/ logout } from "../../actions/auth";

function AuthStatus({ user, ...props }) {
  if (props.loggedIn)
    return (
      <React.Fragment>
        <Dropdown caption={user && user.login}>
          <li>
            <a href="#!" onClick={() => alert("В разработке")}>
              Профиль пользователя
            </a>
          </li>
          <li class="divider" tabindex="-1"></li>
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
    loggedIn: store.auth.loggedIn
  };
};

export default connect(
  mapStateToProps,
  { /* login,*/ logout }
)(AuthStatus);
