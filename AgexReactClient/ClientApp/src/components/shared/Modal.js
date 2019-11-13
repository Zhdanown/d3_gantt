import React from "react";
import { Modal as M_Modal } from "materialize-css";

class Modal extends React.Component {
  state = {
    // isOpen: false,
    instance: null
  };

  componentDidMount() {
    // initialize modal
    var elem = document.querySelector(`#${this.props.name}`);
    M_Modal.init(elem, {
      onCloseEnd: this.props.onClose
    });
    // get instance
    var instance = M_Modal.getInstance(elem);
    // this.setState(() => ({ instance }));
    instance.open();
    console.log(this.props);
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.isOpen !== this.props.isOpen) {
  //     if (this.props.isOpen) {
  //       this.openModal();
  //     } else {
  //       this.closeModal();
  //     }
  //   }
  // }

  // openModal = () => {
  //   const { instance } = this.state;
  //   instance.open();
  // };

  // closeModal = () => {
  //   const { instance } = this.state;
  //   instance.close();
  // };

  render() {
    return (
      <div
        id={this.props.name}
        ref={this.modalRef}
        className={"modal modal-fixed-footer " + this.props.className}
      >
        {/* <div className="modal-content">{this.props.children[0]}</div>
        <div className="modal-footer">{this.props.children[1]}</div> */}
        {this.props.children}
      </div>
    );
  }
}

Modal.defaultProps = {
  className: ""
};

export default Modal;
