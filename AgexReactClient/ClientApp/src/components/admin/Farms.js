import React from "react";
import Checkbox from "../shared/Checkbox";

function Farms() {
  return (
    <div className="col s12">
      <ul class="collapsible">
        <li className="active">
          <div class="collapsible-header">Хозяйства</div>
          <div class="collapsible-body">
            <ul class="collection">
              <li class="collection-item">
                <Checkbox item={{ name: "Бунино", checked: true }} />
              </li>
              <li class="collection-item">
                <Checkbox item={{ name: "Солнцево", checked: true }} />
              </li>
              <li class="collection-item">
                <Checkbox item={{ name: "Камыши", checked: true }} />
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Farms;
