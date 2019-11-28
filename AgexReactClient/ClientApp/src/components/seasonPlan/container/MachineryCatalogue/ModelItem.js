import React, { useState } from "react";

const ModelItem = ({ model }) => {
  const [isOpen, toggleModelItem] = useState(false);
  const productivityRows = model.productivity.map(entry => (
    <tr key={entry.agroOperation.id}>
      <td style={{ padding: ".3rem" }}>{entry.agroOperation.name}</td>
      <td style={{ padding: ".3rem" }}>{entry.productivity} га/сут</td>
    </tr>
  ));
  return (
    <div className="model">
      <p className="model-name" onClick={() => toggleModelItem(!isOpen)}>
        <b>{model.count} шт</b> -{" "}
        {(model.vehicleModel && model.vehicleModel.name) ||
          model.workEquipmentModel.name}
        {productivityRows.length && (
          <React.Fragment>
            {isOpen ? (
              <i className="material-icons">arrow_drop_up</i>
            ) : (
              <i className="material-icons">arrow_drop_down</i>
            )}
          </React.Fragment>
        )}
      </p>
      {isOpen && productivityRows.length !== 0 && (
        <table
          className="modal-productivity"
          style={{ width: "80%", margin: "auto" }}
        >
          <tbody>{productivityRows}</tbody>
        </table>
      )}
    </div>
  );
};

export default ModelItem;
