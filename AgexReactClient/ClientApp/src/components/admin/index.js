import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../apis/adminAPI";

import Navbar from "../shared/Navbar";
import AuthStatus from "../shared/AuthStatus";
import Roles from "./Roles";
import Farms from "./Farms";

import "../../styles/css/admin.css";
import UserFieldsForm from "./UserFieldsForm";
import SearchUser from "./SearchUser";
import SpinnerWrapper from "../shared/SpinnerWrapper";
import Spinner from "../shared/Spinner";

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [isLoadingUser, toggleLoadUserStatus] = useState(false);
  // list of all fethced farms
  const [farms, setFarmList] = useState([]);
  // list of all fetched roles
  const [roles, setRoleList] = useState([]);

  useEffect(() => {
    // fetch farms
    api
      .get("/farm/farms?is_cluster=true")
      .then(res => {
        setFarmList(res.data);
      })
      .catch(error => console.error(error));

    // fetch roles
    api
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

  const onFarmlistChange = farmList => {
    console.log(farmList);
  };
  const onRoleListChange = roleList => {
    console.log(roleList);
  };

  return (
    <React.Fragment>
      <Navbar>
        <ul className="right">
          {/* *********************** */}
          <li>
            <Link to="/sp/tech">
              <i className="material-icons left">directions_car</i>Действия
            </Link>
          </li>
          <li>
            <AuthStatus />
          </li>
        </ul>
      </Navbar>

      <div className="admin-panel">
        <div className="row">
          <div className="col s8 container">
            <SearchUser onUserSelect={fetchUserInfo} />
          </div>
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
              <UserFieldsForm />
            </form>

            <div className="col s6">
              <div className="row">
                <Roles
                  roles={roles}
                  userRoles={(user && user.userRoles) || []}
                  onChange={onRoleListChange}
                />

                <Farms
                  farms={farms}
                  userFarms={(user && user.userFarms) || []}
                  onChange={onFarmlistChange}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}

export default AdminPanel;
