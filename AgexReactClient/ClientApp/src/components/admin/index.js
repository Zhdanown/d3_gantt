import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../apis/adminAPI";
import agex from "../../apis/agex";

import Navbar from "../shared/Navbar";
import AuthStatus from "../shared/AuthStatus";
import Roles from "./Roles";
import Farms from "./Farms";

import "../../styles/css/admin.css";
import UserFieldsForm from "./UserFieldsForm";
import SearchUser from "./SearchUser";
import SpinnerWrapper from "../shared/SpinnerWrapper";
import Spinner from "../shared/Spinner";
import AsyncButton from "../shared/AsyncButton";

function AdminPanel(props) {
  const [user, setUser] = useState(null);
  const [isLoadingUser, toggleLoadUserStatus] = useState(false);
  const [isSubmitting, toggleSubmittingStatus] = useState(false);
  // list of all fethced farms
  const [farms, setFarmList] = useState([]);
  // list of all fetched roles
  const [roles, setRoleList] = useState([]);

  useEffect(() => {
    // fetch farms
    agex
      .get("/farm/farms?is_cluster=true")
      .then(res => {
        setFarmList(res.data);
      })
      .catch(error => console.error(error));

    // fetch roles
    agex
      .get("/user/roles")
      .then(res => {
        setRoleList(res.data);
      })
      .catch(error => console.error(error));
  }, []);

  const fetchUserInfo = selectedUser => {
    if (!selectedUser) return;

    const { id } = selectedUser;
    toggleLoadUserStatus(true);
    api
      .get(`/user/${id}`)
      .then(res => {
        setUser(res.data);
        toggleLoadUserStatus(false);
      })
      .catch(error => {
        console.error(error);
        toggleLoadUserStatus(false);
      });
  };

  const changePassword = newPassword => {
    if (!password) return;
    const bodyRequest = {
      id: user.id,
      firstName,
      lastName,
      login,
      password: newPassword
    };

    api
      .patch(`/user/reset-password/`, bodyRequest)
      .then(res => {
        if (newPassword) toggleIsUserHasPassword(true);
        else {
          setPassword("");
          toggleIsUserHasPassword(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  /*
   ********** userProps ********
   */
  const [isActive, toggleActiveStatus] = useState(false);
  const [isAdmin, toggleAdminStatus] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [userFarms, setUserFarms] = useState([]);

  const [isUserHasPassword, toggleIsUserHasPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    toggleActiveStatus(user.isActive);
    toggleAdminStatus(user.isAdmin);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setMiddleName(user.middleName);
    setLogin(user.login);
    setPassword(user.password);
    toggleIsUserHasPassword(user.password ? true : false);
    setDomain(user.domain);
    setEmail(user.email);
    setPhone(user.phone);
    setUserRoles(user.userRoles);
    setUserFarms(user.userFarms);
  }, [user]);

  const userProps = {
    isActive,
    toggleActiveStatus,
    isAdmin,
    toggleAdminStatus,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    middleName,
    setMiddleName,
    login,
    setLogin,
    password,
    setPassword,
    changePassword,
    isUserHasPassword,
    domain,
    setDomain,
    email,
    setEmail,
    phone,
    setPhone
  };

  const submitChanges = () => {
    const bodyRequest = {
      id: user.id,
      firstName: firstName || null,
      lastName: lastName || null,
      middleName: middleName || null,
      domain: domain || null,
      phone: phone || null,
      login: login || null,
      // password: password || null,
      email: email || null,
      isActive,
      isAdmin,
      userFarms: userFarms
        .filter(x => x.checked)
        .map(x => ({ userId: user.id, farmId: x.id })),
      userRoles: userRoles
        .filter(x => x.checked)
        .map(x => ({ userId: user.id, roleId: x.id }))
    };

    toggleSubmittingStatus(true);
    api.put("/user", bodyRequest).then(res => {
      // console.log(res);
      if (res.status === 200) {
        setUser({
          ...bodyRequest,
          userFarms: userFarms.filter(x => x.checked),
          userRoles: userRoles.filter(x => x.checked)
        });
      }
      toggleSubmittingStatus(false);
    });
  };

  const renderSubmitButton = () => {
    if (!user) return null;

    if (
      isActive === user.isActive &&
      isAdmin === user.isAdmin &&
      !checkIfFarmsDiffer() &&
      !checkIfRolesDiffer()
    )
      return null;

    function checkIfRolesDiffer() {
      let isRolesDiffer = false;

      for (let userRole of userRoles) {
        const isUserHasRole = user.userRoles.find(x => x.id === userRole.id);
        if (userRole.checked && !isUserHasRole) {
          isRolesDiffer = true;
          break;
        } else if (!userRole.checked && isUserHasRole) {
          isRolesDiffer = true;
          break;
        }
      }
      return isRolesDiffer;
    }

    function checkIfFarmsDiffer() {
      let isFarmsDiffer = false;

      for (let userFarm of userFarms) {
        const isUserHasFarm = user.userFarms.find(x => x.id === userFarm.id);
        if (userFarm.checked && !isUserHasFarm) {
          isFarmsDiffer = true;
          break;
        } else if (!userFarm.checked && isUserHasFarm) {
          isFarmsDiffer = true;
          break;
        }
      }
      return isFarmsDiffer;
    }

    return (
      <AsyncButton
        className="btn waves-effect waves-light"
        onClick={submitChanges}
        isLoading={isSubmitting}
        styles={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: "1",
          display: "flex",
          alignItems: "center"
        }}
      >
        Сохранить изменения
      </AsyncButton>
    );
  };

  if (props.user && !props.user.isAdmin)
    return (
      <div className="container center">
        <h5>Недостаточно прав доступа! :(</h5>
        <Link className="btn" to="/">
          На главную
        </Link>
      </div>
    );
  else
    return (
      <React.Fragment>
        <Navbar>
          <ul className="left">
            <li>
              <Link to="/">Главная</Link>
            </li>
          </ul>
          <ul className="right">
            {/* *********************** */}
            {/* <li>
            <Link to="/">
              <i className="material-icons left">directions_car</i>Действия
            </Link>
          </li> */}
            <li>
              <AuthStatus />
            </li>
          </ul>
        </Navbar>

        <div className="admin-panel container">
          <div className="row"></div>
          <div className="row">
            <div className="col s12">
              <SearchUser onUserSelect={fetchUserInfo} />
            </div>
          </div>

          <div className="row">
            <div className="col s12">{renderSubmitButton()}</div>
          </div>

          {/* Show Spinner when loading user profile */}
          {isLoadingUser ? (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          ) : null}

          {user && !isLoadingUser ? (
            <div className="row">
              <form className="col s6">
                <UserFieldsForm userProps={userProps} />
              </form>

              <div className="col s6">
                <div className="row">
                  <div className="col s12">
                    <Roles
                      roles={roles}
                      userRoles={(user && user.userRoles) || []}
                      onChange={setUserRoles}
                    />
                  </div>

                  <div className="col s12">
                    <Farms
                      farms={farms}
                      userFarms={(user && user.userFarms) || []}
                      onChange={setUserFarms}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    isLoggingIn: state.auth.isLoggingIn
  };
};

export default connect(mapStateToProps)(AdminPanel);
