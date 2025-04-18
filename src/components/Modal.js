import React from "react";
import "./Modal.css";

export const Modal = ({ children }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-container">{children}</div>
    </div>
  );
};
