import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "../components/shared/Modal";

export default function confirm(props) {
  confirmAlert({
    customUI: ({ onClose }) => (
      <Modal
        className="confirm"
        name="confirmWindow"
        onClose={() => {
          props.onClose();
          onClose();
        }}
      >
        <div className="modal-content">
          <h5 className="center">{props.message}</h5>
        </div>
        <div className="modal-footer">
          <button
            className="btn left waves-effect waves-light"
            type="button"
            onClick={() => {
              props.onOk();
              onClose();
            }}
          >
            Да
          </button>
          <button
            className="btn waves-effect waves-light"
            type="button"
            onClick={() => {
              props.onClose();
              onClose();
            }}
          >
            Отмена
          </button>
        </div>
      </Modal>
    )
  });
}
