import React from "react";

function MachineryList({ machineryList, removeMachinery }) {
  if (!machineryList.length)
    return <div className="center-align">Нет задействованной техники</div>;
  else
    return (
      <React.Fragment>
        {machineryList.map((item, index) => {
          const { vehicle, workEquipment, productivity } = item;
          return (
            <div key={index} className="machinery-item">
              <span>
                {vehicle.name}
                {workEquipment ? " + " + workEquipment.name : null}
              </span>
              <span>
                {productivity ? (
                  <b className="productivity">{productivity} га/сут</b>
                ) : null}

                <i
                  className="close material-icons"
                  onClick={() => removeMachinery(item)}
                >
                  close
                </i>
              </span>
            </div>
          );
        })}
      </React.Fragment>
    );
}

export default MachineryList;
