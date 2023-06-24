import React from "react";
import Modal from "react-bootstrap/Modal";
import Avatar from '@mui/material/Avatar';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="modal">
        <h1 className="blue-border center-items">{props.username}</h1>
        <div className="center-items blue-border">
        <Avatar
          alt="Remy Sharp"
          src={props.userpic}
          sx={{ width: 200, height: 200 }}
        />
        </div>
        <div className="blue-border center-items">{props.useremail}</div>
      </Modal.Body>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;
