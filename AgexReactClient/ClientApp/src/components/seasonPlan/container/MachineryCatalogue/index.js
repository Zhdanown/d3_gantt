import React, { useEffect, useState } from "react";
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

  // let groupList = (
  //   <ul className="collapsible">
  //     {farms.map(farm => (
  //       <li key={farm.id}>
  //         <div className="collapsible-header">
  //           {/* <i className="material-icons">filter_drama</i> */}
  //           {farm.name}
  //         </div>
  //         <div className="collapsible-body">
  //           {farm.vehicles.map((vehicle, index) => (
  //             <ModelItem key={index} vehicle={vehicle}/>
  //           ))}
  //         </div>
  //       </li>
  //     ))}
  //   </ul>
  // );

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
        {/* <ul className="tabs tabs-fixed-width z-depth-1">
          <li className="tab">
            <a className="active" href="#vehicles">
              Самоходная техника
            </a>
          </li>
          <li className="tab">
            <a href="#equipment">Прицепное оборудование</a>
          </li>
        </ul> */}
        <div id="vehicles" className="col s12 list">
          <ModelsTab models={vehicles} />
        </div>
        <div id="equipment" className="col s12 list">
          {<ModelsTab models={equipment} />}
        </div>
      </div>
      <div className="modal-footer">
        {/* <Link to="/" className="modal-close waves-effect btn-flat">
          Закрыть
        </Link> */}
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
