import React from "react";
import Spinner from "react-bootstrap/Spinner";

export function BasicSpinner() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
