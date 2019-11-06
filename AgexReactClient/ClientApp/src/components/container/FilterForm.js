import React, { useState } from "react";
import { connect } from "react-redux";
import history from "../../history";

// import components
import Modal from "../shared/Modal";
import CheckboxList from "../shared/CheckboxList";

// import actions
import { filterCrops } from "../../actions/filter";

function FilterForm({ ...props }) {
  // get list of unique crops
  let crops = props.operations.flatMap(operation => operation.crop);
  crops = [...new Set(crops.map(x => JSON.stringify(x)))].map(x =>
    JSON.parse(x)
  );

  // syncronize checkboxes state with applied filter
  crops.map(crop => {
    if (props.filteredCrops.find(x => x.id === crop.id)) crop.checked = false;
    else crop.checked = true;
  });

  // get list of unique farms
  let farms = props.operations.flatMap(operation => operation.farm);
  farms = [...new Set(farms.map(x => JSON.stringify(x)))].map(x =>
    JSON.parse(x)
  );

  // syncronize checkboxes state with applied filter
  farms.map(farm => {
    if (props.filteredFarms.find(x => x.id === farm.id)) farm.checked = false;
    else farm.checked = true;
  });

  /*
   ********** STATE ********
   */

  const [cropList, setCropList] = useState(crops);
  const [farmList, setFarmList] = useState(farms);

  const applyFilter = () => {
    // get list of crops to filter out
    const cropsToFilterOut = cropList.filter(crop => !crop.checked);
    // get list of farms to filter out
    const farmsToFilterOut = farmList.filter(farm => !farm.checked);

    props.filterCrops({ crops: cropsToFilterOut, farms: farmsToFilterOut });
  };

  return (
    <Modal name="filterForm" onClose={() => history.push("/")}>
      <div className="modal-content">
        <div className="row">
          <div className="col S6">
            <CheckboxList
              list={farmList}
              onListChange={newList => setFarmList(newList)}
            />
          </div>

          <div className="col s6">
            <CheckboxList
              list={cropList}
              onListChange={newList => setCropList(newList)}
            />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">
          Отмена
        </a>
        <button
          className="btn waves-effect waves-light modal-close"
          type="submit"
          name="action"
          form="period-form"
          onClick={applyFilter}
        >
          Применить фильтр
          <i className="material-icons right">add</i>
        </button>
      </div>
    </Modal>
  );
}

const mapStateToProps = state => {
  let { plans, filter } = state.plan;
  if (plans.length) {
    var operations = plans.reduce((acc, cur) => {
      let plan = { id: cur.id, name: cur.name };

      acc = [...acc, ...cur.operations];
      return acc;
    }, []);

    return {
      operations,
      filteredCrops: filter.crops,
      filteredFarms: filter.farms
    };
  } else {
    return {
      operations: [],
      filteredCrops: [],
      filteredFarms: []
    };
  }
};

export default connect(
  mapStateToProps,
  { filterCrops }
)(FilterForm);
