import React from "react";
import ModelItem from "./ModelItem";

function ModelsTab({ models, type }) {
  // get list of farms
  let farms = models.reduce((acc, entry) => {
    if (!acc.find(x => x.id === entry.farm.id)) acc = [...acc, entry.farm];
    return acc;
  }, []);

  for (let farm of farms) {
    farm.models = models.filter(model => model.farm.id === farm.id);
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
            {farm.models.map((model, index) => (
              <ModelItem key={index} model={model} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );

  return groupList;
}

export default ModelsTab;
