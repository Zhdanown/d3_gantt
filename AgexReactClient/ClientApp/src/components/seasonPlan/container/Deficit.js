import React from "react";

const style = {
  position: "absolute",
  bottom: 0,
  left: 0,
  margin: "2em",
  background: "#323232",
  color: "white",
  padding: "10px 25px",
  borderRadius: "2px",
  zIndex: 2
};

function Deficit({ info }) {
  if (!info) return null;
  const { deficit, machinery } = info;

  console.log(info);

  const vehicles = machinery.flatMap(pair => pair.vehicleModel);
  const equipment = machinery.flatMap(pair => pair.workEquipmentModel);
  let modelsList = [...vehicles, ...equipment];
  // filter out models equal to null (no equipment in pair)
  modelsList = modelsList.filter(x => x);
  // modelsList
  modelsList = modelsList.map(model => (
    <React.Fragment key={model.id + model.farm.id}>
      <span>
        1 {model.name} ({model.farm.name})
      </span>
      <br />
    </React.Fragment>
  ));
  const deficitList =
    deficit &&
    deficit.map(entry => (
      <React.Fragment key={entry.id + entry.farm.id}>
        <span style={{ color: "red" }}>
          {entry.balance} {entry.name} ({entry.farm.name})
        </span>
        <br />
      </React.Fragment>
    ));
  return (
    <div className="deficitWindow" style={style}>
      {modelsList}
      {deficitList}
    </div>
  );

  // if (dayInfo && dayInfo.length) {
  //   let list = dayInfo.map(entry => (
  //     <React.Fragment key={entry.id + entry.farm.id}>
  //       <span>
  //         {entry.balance} {entry.name} ({entry.farm.name})
  //       </span>
  //       <br />
  //     </React.Fragment>
  //   ));
  //   return (
  //     <div className="deficitWindow" style={style}>
  //       {list}
  //     </div>
  //   );
  // } else return null;
}

export default Deficit;
