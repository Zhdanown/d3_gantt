import React from "react";

class Modal extends React.Component {
  state = {
    // isOpen: false,
    instance: null
  };

  componentDidMount() {
    // initialize modal
    var elem = document.querySelector(`#${this.props.name}`);
    window.M.Modal.init(elem, {
      onCloseEnd: this.props.onClose
    });
    // get instance
    var instance = window.M.Modal.getInstance(elem);
    // this.setState(() => ({ instance }));
    instance.open();
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
        className="modal modal-fixed-footer"
      >
        {/* <div className="modal-content">{this.props.children[0]}</div>
        <div className="modal-footer">{this.props.children[1]}</div> */}
        {this.props.children}
      </div>
    );
  }
}

export default Modal;
