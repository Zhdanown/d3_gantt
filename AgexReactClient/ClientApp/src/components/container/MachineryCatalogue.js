import React, { useEffect } from "react";
import { connect } from "react-redux";
import history from "../../history";

import { Link } from "react-router-dom";
import Modal from "../shared/Modal";

import "../../styles/css/machineryCatalogue.css";

const ModelItem = ({ vehicle }) => (
  <span className="model">
    <b>{vehicle.count} шт</b> - {vehicle.vehicleModel.name}
  </span>
);

function MachineryCatalogue({ vehicles, equipment }) {
  useEffect(() => {
    // init tabs
    let tabs = document.querySelector(".tabs");
    window.M.Tabs.init(tabs);
  }, []);

  useEffect(() => {
    // init collapsible
    let collapsible = document.querySelector(".collapsible");
    window.M.Collapsible.init(collapsible, { accordion: false });
  }, [vehicles]);

  // get list of farms
  let farms = vehicles.reduce((acc, entry) => {
    if (!acc.find(x => x.id === entry.farm.id)) acc = [...acc, entry.farm];
    return acc;
  }, []);
  console.log(farms);

  for (let farm of farms) {
    farm.vehicles = vehicles.filter(vehicle => vehicle.farm.id === farm.id);
  }

  let groupList = (
    <ul className="collapsible">
      {farms.map(farm => (
        <li key={farm.id}>
          <div className="collapsible-header">
            {/* <i className="material-icons">filter_drama</i> */}
            {farm.name}
          </div>
          <div className="collapsible-body">
            {farm.vehicles.map(vehicle => (
              <ModelItem vehicle={vehicle} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );

  let vehicleList = vehicles.map(vehicle => <ModelItem vehicle={vehicle} />);

  return (
    <Modal name="machineryCatalogue" onClose={() => history.push("/")}>
      <div className="modal-content machineryCatalogue">
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
        <div id="vehicles" className="col s12 list">
          {/* {vehicleList} */}
          {groupList}
        </div>
        <div id="equipment" className="col s12 list">
          <p>Equipment</p>
        </div>
      </div>
      <div className="modal-footer">
        <Link to="/" className="modal-close waves-effect waves-green btn-flat">
          Закрыть
        </Link>
        {/* <button
          className="btn waves-effect waves-light modal-close"
          type="submit"
          name="action"
          form="period-form"
          // onClick={applyFilter}
        >
          Применить фильтр
          <i className="material-icons right">add</i>
        </button> */}
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
