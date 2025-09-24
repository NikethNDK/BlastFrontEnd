import React, { useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { addPartialApi } from "../../../services/AppinfoService";

const PartialNameModal = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const partialData = {
      partial_name: formData.get("partialName"),
    };

    addPartialApi(partialData)
      .then((result) => {
        window.alert("Data added successfully");
        props.setUpdated(true);
      })
      .catch((error) => {
        console.error("Failed to Add Partial Data", error); // Log the error to the console
        // alert("Failed to Add Partial. Check console for details.");
      });
  };

  return (
    <div className="container">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Partial Gene Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={11}>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="partialName">
                  <Form.Label>Partial Gene ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="partialName"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>

                <Form.Group>
                  <p></p>
                  <div style={{ float: "right" }}>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={props.onHide}
                      style={{ marginRight: "8px" }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="danger"
                      type="submit"
                      onClick={props.onHide}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default PartialNameModal;
