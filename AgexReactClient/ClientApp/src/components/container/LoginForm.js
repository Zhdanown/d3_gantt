import React, { useState } from "react";
import { connect } from "react-redux";
import Modal from "../shared/Modal";
import history from "../../history";
/** import styles */
import "../../styles/css/login-form.css";
/** import actions */
import { login } from "../../actions/auth";

function LoginForm(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onClose = () => {
    history.push("/");
  };

  const onFormSubmit = event => {
    event.preventDefault();
    props.login(username, password);
  };

  return (
    <Modal name="loginForm" onClose={onClose}>
      <form className="login-form" onSubmit={onFormSubmit}>
        <div className="modal-content">
          <h5 className="center">Вход в систему</h5>
          <div className="row">
            <div className="input-field col s6">
              <input
                type="text"
                id="user_login"
                value={username}
                onChange={e => setUserName(e.target.value)}
              />
              <label htmlFor="#user_login">Логин</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <label htmlFor="password">Пароль</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12 center">
              <button
                className="btn waves-effect waves-light modal-close"
                type="submit"
                // onClick={fetchPlan}
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default connect(
  null,
  { login }
)(LoginForm);
