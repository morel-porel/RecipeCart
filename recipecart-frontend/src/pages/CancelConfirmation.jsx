import React, { useEffect } from "react";
import "./CancelConfirmation.css";

const CancelConfirmation = ({ onConfirm = () => {}, onClose = () => {} }) => {
  useEffect(() => {
    console.log("CancelConfirmation mounted");
    return () => console.log("CancelConfirmation unmounted");
  }, []);

  return (
    <div className="cc-backdrop" data-test-id="cancel-confirmation">
      <div className="cc-modal">
        <button
          className="cc-close-x"
          onClick={onClose}
          aria-label="close"
          title="Close"
        >
          ×
        </button>
        <div className="cc-message">
          Are you sure you want to cancel your order?
        </div>
        <div className="cc-actions">
          <button
            className="cc-confirm-btn"
            onClick={() => {
              console.log("CancelConfirmation: Confirm clicked");
              onConfirm();
            }}
          >
            Confirm
          </button>
          <button
            className="cc-cancel-btn"
            onClick={() => {
              console.log("CancelConfirmation: Close clicked");
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmation;