import React from "react";
import { connect } from "react-redux";

function Loader(props) {
  return (
    <div
      className="loader"
      style={{
        position: "fixed",
        background: "rgba(50, 50, 50, .8",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        className=""
        style={{
          padding: "2rem 4rem",
          background: "#222",
          color: "white",
          borderRadius: "4px"
        }}
      >
        <div className="wrapper">Loading...</div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    text: "Загрузка сезонов"
  };
};

export default connect(mapStateToProps)(Loader);
