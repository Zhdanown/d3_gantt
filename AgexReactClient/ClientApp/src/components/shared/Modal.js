import React, { createRef } from "react";
import { Modal as M_Modal } from "materialize-css";

class Modal extends React.Component {
  modalRef = createRef();

  componentDidMount() {
    // initialize modal
    M_Modal.init(this.modalRef.current, {
      onCloseEnd: this.props.onClose
    });
    // get instance
    var instance = M_Modal.getInstance(this.modalRef.current);
    instance.open();
  }

  closeModal = () => {
    // get instance
    var instance = M_Modal.getInstance(this.modalRef.current);
    instance.close();
  };

  render() {
    return (
      <div
        id={this.props.name}
        ref={this.modalRef}
        className={"modal modal-fixed-footer " + this.props.className}
      >
        <i className="material-icons close-button"
          style={{position: "absolute", top: "5px", right: "20px", zIndex: 2, cursor: "pointer"}}
          onClick={() => this.closeModal()}
        >
          close
        </i>
        {this.props.children}
      </div>
    );
  }
}

Modal.defaultProps = {
  className: ""
};

export default Modal;
