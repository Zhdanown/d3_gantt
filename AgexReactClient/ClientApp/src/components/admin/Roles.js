import React from "react";
import Checkbox from "../shared/Checkbox";

function Roles() {
  return (
    <div className="col s12">
      <ul class="collapsible">
        <li className="active">
          <div class="collapsible-header">Роли</div>
          <div class="collapsible-body">
            <ul class="collection">
              <li class="collection-item">
                <Checkbox item={{ name: "Director", checked: true }} />
              </li>
              <li class="collection-item">
                <Checkbox item={{ name: "Agronom", checked: true }} />
              </li>
              <li class="collection-item">
                <Checkbox item={{ name: "Specialist", checked: true }} />
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Roles;
