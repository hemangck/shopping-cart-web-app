import { useState } from "react";

// function to display toast message
const ToastMsg = ({ opType, msg }) => {
  // defining required states
  const [visible, setVisible] = useState(true);

  /* storing operation name
     based on type of operation */
  const operationName =
    opType === "success" ? "Success" :
    opType === "warning" ? "Alert" :
    opType === "danger"  ? "Failure" : "Unknown";

  /* storing toast color
     based on type of operation */
  const toastColor =
    opType === "success" ? "#28a745" :
    opType === "warning" ? "#eed202" :
    opType === "danger"  ? "#A6192E" : "#808080";  

  // if 'visible' state is false then return null
  if (!visible) return null;

  // returning toast component
  return (
    <div
      className={`toast show toast-${opType}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 1080,
        minWidth: 280
      }}
    >
      <div className="toast-header">
        <span
          className="rounded me-2"
          style={{ width: 12, height: 12, background: toastColor, display: "inline-block" }}
        />
        <strong className="me-auto">{operationName}</strong>
        <button
          type="button"
          className="btn-close"
          onClick={() => setVisible(false)}
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{msg}</div>
    </div>
  );
};

export default ToastMsg;
