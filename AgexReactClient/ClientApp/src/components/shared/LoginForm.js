import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import history from "../../history";
import { Modal as M_Modal } from "materialize-css";

import Modal from "./Modal";
import Spinner from "./Spinner";
/** import styles */
import "../../styles/css/login-form.css";
/** import actions */
import { login } from "../../actions/auth";

function LoginForm({ user, ...props }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);

  useEffect(() => {
    usernameInput.current.focus();
  }, []);

  const onClose = () => {
    console.log(props);
    // debugger;
    // history.push("/sp"); // TODO
    props.history.goBack();
  };

  const onFormSubmit = async event => {
    event.preventDefault();
    const response = await props.login(username, password);

    if (response && response.status === 200) {
      // get modal instance
      let elem = document.querySelector("#loginForm");
      let instance = M_Modal.getInstance(elem);
      instance.close();
      setError(null);
    } else {
      setPassword("");
      passwordInput.current.focus();
      setError(response.data.message);
    }
  };

  return (
    <Modal name="loginForm" onClose={onClose}>
      <form className="login-form" onSubmit={onFormSubmit}>
        <div className="modal-content">
          <h5 className="center">
            {user
              ? "Вход выполнен под учетной записью " + user.login
              : "Вход в систему"}
          </h5>
          <div className="row">
            <div className="input-field col s6">
              <input
                ref={usernameInput}
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
                ref={passwordInput}
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <label htmlFor="password">Пароль</label>
            </div>
          </div>

          <p className="error">{error}</p>
          <div className="row">
            <div className="col s12 center">
              {props.isLoggingIn ? (
                <Spinner />
              ) : (
                <button className="btn waves-effect waves-light" type="submit">
                  Войти
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    authError: state.auth.error,
    isLoggingIn: state.auth.isLoggingIn
  };
};

export default connect(mapStateToProps, { login })(LoginForm);
