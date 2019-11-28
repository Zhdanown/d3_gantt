import React, { useState, useEffect } from "react";
import { Suspense, lazy } from "react";
import { Router, Route, Switch, Link } from "react-router-dom";
import history from "../history";

/** import styles */
import "../styles/css/materialize.css";
import "../styles/css/main.css";
import "../styles/css/season-plan.css";

import AdminPanel from "./admin";
import LoginForm from "./shared/LoginForm";

import Spinner from "./shared/Spinner";
import SpinnerWrapper from "./shared/SpinnerWrapper";
import Navbar from "./shared/Navbar";

const SeasonPlan = lazy(() => import("./seasonPlan"));

/** import components */

function App({ ...props }) {
  // const showDeficit = deficitToShow => {
  //   props.showDeficit(deficitToShow);
  // };

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
                    <li>
                      <Link to="/admin">
                        <i className="material-icons left">build</i>Панель
                        администратора
                      </Link>
                    </li>
                  </ul>
                </Navbar>
              )}
            />

            <Route path="/sp" component={props => <SeasonPlan {...props} />} />
            <Route path="/admin" component={AdminPanel} />
          </Suspense>

          <Route path="/login" component={LoginForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
