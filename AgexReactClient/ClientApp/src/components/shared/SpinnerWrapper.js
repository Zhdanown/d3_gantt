import React from "react";

const styles = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

function SpinnerWrapper(props) {
  return (
    <div className="spinner-wrapper" style={styles}>
      {props.children}
    </div>
  );
}

export default SpinnerWrapper;
