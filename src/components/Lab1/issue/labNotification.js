import React, { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const NotificationBell = ({ message }) => {
  const [showNotification, setShowNotification] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [ringBell, setRingBell] = React.useState(false);

  // Show the notification modal whenever there's a new message
  useEffect(() => {
    if (message) {
      setShowNotification(true);
      setNotificationCount((prevCount) => prevCount + 1); // Increment notification count

      // Ring the bell
      setRingBell(true);

      // Auto-close the modal after 3 seconds
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [message]);

  // Close the notification modal and reset the notification count
  const handleCloseNotification = () => {
    setShowNotification(false);
    setNotificationCount(0); // Reset notification count after user sees the message
  };

  // Handle bell ring animation
  useEffect(() => {
    if (ringBell) {
      const bellTimer = setTimeout(() => setRingBell(false), 1000); // Bell rings for 1 second
      return () => clearTimeout(bellTimer); // Cleanup bell ring
    }
  }, [ringBell]);

  return (
    <>
      <span
        style={{
          color: "white",
          fontSize: "24px",
          marginRight: "20px",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => setShowNotification(true)}
        aria-label="Notification Bell"
      >
        <i
          className={`fas fa-bell ${ringBell ? "animate-ring" : ""}`}
          style={{ fontSize: "24px", color: "white" }}
        ></i>
        {notificationCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 8px",
              fontSize: "14px",
            }}
          >
            {notificationCount}
          </span>
        )}
      </span>

      {/* Notification Modal */}
      <Modal show={showNotification} onHide={handleCloseNotification}>
        <Modal.Header closeButton>
          <Modal.Title>New Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="notificationMessage">
              {/* Displaying the message */}
              <Form.Label>{message || "No notifications yet."}</Form.Label>{" "}
              {/* Default message */}
            </Form.Group>
            <Button variant="primary" onClick={handleCloseNotification}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* CSS for Bell Ringing Animation */}
      <style>
        {`
          @keyframes ringBell {
            0% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(15deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }

          .animate-ring {
            animation: ringBell 1s ease-in-out;
          }
        `}
      </style>
    </>
  );
};

export default NotificationBell;
