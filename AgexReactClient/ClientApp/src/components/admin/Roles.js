import React, { useState, useEffect } from "react";
import Checkbox from "../shared/Checkbox";
import CollapsibleCard from "../shared/CollapsibleCard";
import CheckboxList from "../shared/CheckboxList";
import Spinner from "../shared/Spinner";
import SpinnerWrapper from "../shared/SpinnerWrapper";

function Roles({ roles, userRoles, ...props }) {
  // syncronize checkboxes state
  roles = roles.map(role => ({
    ...role,
    checked: userRoles.find(x => x.id === role.id) ? true : false
  }));

  const [roleList, setRoleList] = useState(roles);

  useEffect(() => {
    props.onChange(roleList);
  }, [roleList]);

  return (
    <CollapsibleCard header="Роли">
      {roles.length ? (
        <CheckboxList
          list={roleList}
          onListChange={newList => setRoleList(newList)}
        />
      ) : (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
    </CollapsibleCard>
  );
}

export default Roles;
