import React, { useState } from "react";
import { connect } from "react-redux";
import history from "../../../history";

// import components
import { Link } from "react-router-dom";
import Modal from "../../shared/Modal";
import CheckboxList from "../../shared/CheckboxList";

// import actions
import { filter } from "../../../actions/filter";

function sortByName(entries) {
  return entries.sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });
}

function FilterForm({ ...props }) {
  /*
   ********** CROPS ********
   */

  // get list of unique crops
  let crops = props.operations.flatMap(operation => operation.crop);
  crops = [...new Set(crops.map(x => JSON.stringify(x)))].map(x =>
    JSON.parse(x)
  );
  crops = sortByName(crops);
  // syncronize checkboxes state with applied filter
  crops.map(crop => {
    if (props.filteredCrops.find(x => x.id === crop.id)) crop.checked = false;
    else crop.checked = true;
  });

  /*
   ********** FARMS ********
   */

  // get list of unique farms
  let farms = props.operations.flatMap(operation => operation.farm);
  farms = [...new Set(farms.map(x => JSON.stringify(x)))].map(x =>
    JSON.parse(x)
  );
  farms = sortByName(farms);
  // syncronize checkboxes state with applied filter
  farms.map(farm => {
    if (props.filteredFarms.find(x => x.id === farm.id)) farm.checked = false;
    else farm.checked = true;
  });

  /*
   ********** AGROOPERATIONS ********
   */

  // get list of unique agrooperations
  let agroOperations = props.operations.flatMap(
    operation => operation.agroOperation
  );
  agroOperations = [
    ...new Set(agroOperations.map(x => JSON.stringify(x)))
  ].map(x => JSON.parse(x));
  agroOperations = sortByName(agroOperations);
  // syncronize checkboxes state with applied filter
  agroOperations.map(agroOperation => {
    if (props.filteredAgroOperations.find(x => x.id === agroOperation.id))
      agroOperation.checked = false;
    else agroOperation.checked = true;
  });

  /*
   ********** STATE ********
   */

  const [cropList, setCropList] = useState(crops);
  const [farmList, setFarmList] = useState(farms);
  const [agroOperationList, setAgroOperationList] = useState(agroOperations);

  const applyFilter = () => {
    // get list of crops to filter out
    const cropsToFilterOut = cropList.filter(crop => !crop.checked);
    // get list of farms to filter out
    const farmsToFilterOut = farmList.filter(farm => !farm.checked);
    // get list of agroOperations to filter out
    const agroOperationsToFilterOut = agroOperationList.filter(
      agroOperation => !agroOperation.checked
    );

    props.filter({
      crops: cropsToFilterOut,
      farms: farmsToFilterOut,
      agroOperations: agroOperationsToFilterOut
    });
  };

  return (
    <Modal name="filterForm" onClose={() => history.push("/sp")}>
      <div className="modal-content">
        <div className="row">
          <div className="col s4">
            <CheckboxList
              list={farmList}
              onListChange={newList => setFarmList(newList)}
            />
          </div>

          <div className="col s4">
            <CheckboxList
              list={cropList}
              onListChange={newList => setCropList(newList)}
            />
          </div>

          <div className="col s4">
            <CheckboxList
              list={agroOperationList}
              onListChange={newList => setAgroOperationList(newList)}
            />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <Link to="/" className="modal-close waves-effect btn-flat">
          Отмена
        </Link>
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
      filteredFarms: filter.farms,
      filteredAgroOperations: filter.agroOperations
    };
  } else {
    return {
      operations: [],
      filteredCrops: [],
      filteredFarms: [],
      filteredAgroOperations: []
    };
  }
};

export default connect(mapStateToProps, { filter })(FilterForm);
