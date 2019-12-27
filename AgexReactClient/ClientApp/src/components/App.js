import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Suspense, lazy } from "react";
import { Router, Route, Switch, Link } from "react-router-dom";
import history from "../history";

/** import styles */
import "../styles/css/materialize.css";
import "../styles/css/main.css";
import "../styles/css/season-plan.css";
import "material-icons/iconfont/material-icons.css";

/** import actions */
import { getUserProfile } from "../actions/auth";

import LoginForm from "./shared/LoginForm";

import Spinner from "./shared/Spinner";
import SpinnerWrapper from "./shared/SpinnerWrapper";
import Navbar from "./shared/Navbar";

const SeasonPlan = lazy(() => import("./seasonPlan"));
const AdminPanel = lazy(() => import("./admin"));
/** import components */

function App({ isAccess, ...props }) {
  useEffect(() => {
    props.getUserProfile();
  }, []);

  return (
    <Router history={history}>
      <div className="app">
        <Switch>
          <Suspense
            fallback={
              <SpinnerWrapper>
                <Spinner />
              </SpinnerWrapper>
            }
          >
            <Route
              exact
              path="/"
              component={props => (
                <Navbar>
                  <ul className="right">
                    {/* *********************** */}
                    <li>
                      <Link to="/sp">
                        <i className="material-icons left">directions_car</i>
                        Сезонный план
                      </Link>
                    </li>
                    {isAccess && (
                      <li>
                        <Link to="/admin">
                          <i className="material-icons left">build</i>Панель
                          администратора
                        </Link>
                      </li>
                    )}
                  </ul>
                </Navbar>
              )}
            />

            <Route path="/sp" component={props => <SeasonPlan {...props} />} />
            <Route
              path="/admin"
              component={props => <AdminPanel {...props} />}
            />
            <Route path="/login" component={LoginForm} />
          </Suspense>

          {/* <Route path="/login" component={LoginForm} /> */}
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    isAccess: state.auth.user && state.auth.user.isAdmin
  };
};

export default connect(mapStateToProps, {
  getUserProfile
})(App);
