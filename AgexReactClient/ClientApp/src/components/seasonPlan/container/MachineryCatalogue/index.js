import React, { useEffect } from "react";
import { connect } from "react-redux";
import history from "../../../../history";
import { Tabs, Collapsible } from "materialize-css";

import Modal from "../../../shared/Modal";
import ModelsTab from "./ModelsTab";
import Spinner from "../../../shared/Spinner";
import SpinnerWrapper from "../../../shared/SpinnerWrapper";

import "../../../../styles/css/machineryCatalogue.css";

function MachineryCatalogue({ vehicles, equipment }) {
  useEffect(() => {
    // init tabs
    let tabs = document.querySelector(".tabs");
    Tabs.init(tabs);
  }, []);

  useEffect(() => {
    // init collapsible
    let collapsible = document.querySelectorAll(".collapsible");
    Collapsible.init(collapsible, { accordion: false });
  }, [vehicles, equipment]);

  // get list of farms
  let farms = vehicles.reduce((acc, entry) => {
    if (!acc.find(x => x.id === entry.farm.id)) acc = [...acc, entry.farm];
    return acc;
  }, []);

  for (let farm of farms) {
    farm.vehicles = vehicles.filter(vehicle => vehicle.farm.id === farm.id);
  }

  return (
    <Modal
      name="machineryCatalogue"
      onClose={() => history.push("/sp")}
      className="big"
    >
      <div className="modal-content machineryCatalogue">
        {!(vehicles.length && equipment.length) && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}

        <div id="vehicles" className="col s12 list">
          <ModelsTab models={vehicles} />
        </div>
        <div id="equipment" className="col s12 list">
          {<ModelsTab models={equipment} />}
        </div>
      </div>
      <div className="modal-footer">
        <ul className="tabs tabs-fixed-width z-depth-1">
          <li className="tab">
            <a className="active" href="#vehicles">
              Самоходная техника
            </a>
          </li>
          <li className="tab">
            <a href="#equipment">Прицепное оборудование</a>
          </li>
        </ul>
      </div>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    vehicles: state.machinery.vehicles,
    equipment: state.machinery.equipment
  };
};

MachineryCatalogue.defaultProps = {
  vehicles: [],
  equipment: []
};

export default connect(mapStateToProps)(MachineryCatalogue);
