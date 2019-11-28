import React, { useEffect } from "react";
import { Autocomplete, Collapsible } from "materialize-css";

import Checkbox from "../shared/Checkbox";
import Roles from "./Roles";
import Farms from "./Farms";

import "../../styles/css/admin.css";
import Attributes from "./Attributes";

function AdminPanel() {
  useEffect(() => {
    // init autocomplete
    var elems = document.querySelectorAll(".autocomplete");
    Autocomplete.init(elems, {
      data: {
        Vasya: null,
        Petya: null,
        Vanya: "https://placehold.it/250x250"
      }
    });

    // init collapsible
    const elem = document.querySelectorAll(".collapsible");
    Collapsible.init(elem, { accordion: false });
  }, []);

  return (
    <div className="admin-panel">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">account_circle</i>
          <input type="text" id="autocomplete-input" class="autocomplete" />
          <label for="autocomplete-input">Поиск сотрудника</label>
        </div>
      </div>

      <div className="row">
        <form className="col s6">
          <Attributes />
        </form>

        <div className="col s6">
          <div className="row">
            <Roles />

            <Farms />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
