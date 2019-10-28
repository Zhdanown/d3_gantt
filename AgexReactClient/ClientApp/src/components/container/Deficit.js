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

function Deficit({ deficit }) {
  if (deficit && deficit.length) {
    let list = deficit.map(entry => (
      <React.Fragment key={entry.id}>
        <span>
          {entry.balance} {entry.name}
        </span>
        <br />
      </React.Fragment>
    ));
    return (
      <div className="deficitWindow" style={style}>
        {list}
      </div>
    );
  } else return null;
}

export default Deficit;
