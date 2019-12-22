import React, { useState, useEffect, useRef } from "react";

const style = {
  position: "absolute",
  // bottom: 0,
  // left: 0,
  // margin: "2em",
  background: "#323232",
  color: "white",
  padding: "10px 25px",
  borderRadius: "2px",
  zIndex: 2,
  width: "max-content"
};

function Deficit({ info, mouse }) {
  if (!info) return null;
  const { deficit, machinery } = info;

  var deficitWindowRef = useRef();

  // calculate window position
  var left, top;
  var margin = 20;
  if (deficitWindowRef.current) {
    var w = deficitWindowRef.current.clientWidth;
    var h = deficitWindowRef.current.clientHeight;
    // handle left
    if (mouse.x + w / 2 > window.innerWidth) {
      left = mouse.x - w - margin;
    } else if (mouse.x - w / 2 < 0) {
      left = mouse.x + margin;
    } else {
      left = mouse.x - w / 2;
    }
    // handle top
    if (mouse.y + h + margin > window.innerHeight) {
      top = mouse.y - h - margin;
    } else {
      top = mouse.y + margin;
    }
  }

  const vehicles = machinery.flatMap(pair => pair.vehicleModel);
  const equipment = machinery.flatMap(pair => pair.workEquipmentModel);
  let modelsList = [...vehicles, ...equipment];
  // filter out models equal to null (no equipment in pair)
  modelsList = modelsList.filter(x => x);
  // modelsList
  modelsList = modelsList.map((model, index) => (
    <React.Fragment key={index}>
      <span>
        {model.name} ({model.farm.name})
      </span>
      <br />
    </React.Fragment>
  ));
  const deficitList =
    deficit &&
    deficit.map((entry, index) => (
      <React.Fragment key={index}>
        <span style={{ color: "red" }}>
          {entry.balance} {entry.name} ({entry.farm.name})
        </span>
        <br />
      </React.Fragment>
    ));
  return (
    <div
      ref={deficitWindowRef}
      className="deficitWindow"
      style={{ ...style, left, top }}
    >
      <h5>Состав техники</h5>
      {modelsList}
      {deficit && <h5>Из них в дефиците</h5>}

      {deficitList}
    </div>
  );
}

export default Deficit;
