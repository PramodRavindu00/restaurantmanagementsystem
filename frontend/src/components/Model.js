import React from "react";
import { Modal } from "react-bootstrap";

function Model({ title, body, footer, show, close }) {
  return (
    <div>
      <Modal show={show} onHide={close} centered>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{body}</Modal.Body>
          <Modal.Footer>{footer}</Modal.Footer>
      </Modal>
    </div>
  );
}

export default Model;
