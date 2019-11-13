import React, { useState } from "react";
import { connect } from "react-redux";
import history from "../../history";
import Modal from "../shared/Modal";
import Spinner from "../shared/Spinner";
/** import styles */
import "../../styles/css/login-form.css";
/** import actions */
import { login } from "../../actions/auth";

function LoginForm(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onClose = () => {
    history.push("/");
  };

  const onFormSubmit = async event => {
    event.preventDefault();
    const response = await props.login(username, password);

    if (response.status === 200) {
      // get modal instance
      let elem = document.querySelector("#loginForm");
      let instance = window.M.Modal.getInstance(elem);
      instance.close();
      setError(null);
    } else {
      setPassword("");
      setError(response.data.message);
    }
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
    authError: state.auth.error,
    isLoggingIn: state.auth.isLoggingIn
  };
};

export default connect(
  mapStateToProps,
  { login }
)(LoginForm);
