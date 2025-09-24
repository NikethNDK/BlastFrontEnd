import React, { useState, useEffect } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
import { addDnaApi } from "../../services/AppinfoService";

const AddDnaModal = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract values from the form
    const formData = new FormData(e.target);

    const dnaData = {
      class_name: formData.get("class_name"),
      commaon_name: formData.get("commaon_name"),
      scientific_name: formData.get("scientific_name"),
      partial_CB_Gs: formData.get("partial_CB_Gs"),
      partial16s_RNA_Gs: formData.get("partial16s_RNA_Gs"),
      partial12s_RNA_Gs: formData.get("partial12s_RNA_Gs"),
      partial16s_RNA_Ss: formData.get("partial16s_RNA_Ss"),
      partial12s_RNA_Ss: formData.get("partial12s_RNA_Ss"),
      sub_name_designation: formData.get("sub_name_designation"),
      reference_id: formData.get("reference_id"),
    };

    addDnaApi(dnaData)
      .then((result) => {
        console.log(dnaData);
        window.alert("Data added successfully");
        props.setUpdated(true);
        props.onHide(); // Close the modal only if data is successfully added
      })
      .catch((error) => {
        console.error("Failed to Add Dna:", error);
        alert("Failed to Add Dna: " + error.message);
      });
  };

  return (
    <div className="container">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Dna Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group controlId="class_name">
                  <Form.Label>Class</Form.Label>
                  <Form.Control
                    type="text"
                    name="class_name"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="commaon_name">
                  <Form.Label>Common Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="commaon_name"
                    required
                    style={{ border: "1px solid black" }}
                    placeholder=""
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="scientific_name">
                  <Form.Label>Scientific Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="scientific_name"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p></p>
            <Row>
              <Col>
                <Form.Group controlId="partial_CB_Gs">
                  <Form.Label>Partial Cyt-B gene sequence</Form.Label>
                  {/* Provide options for Chemical and Inventory */}
                  <Form.Control
                    type="text"
                    name="partial_CB_Gs"
                    required
                    style={{ border: "1px solid black" }}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="partial16s_RNA_Gs">
                  <Form.Label>Partial 16s rRNA gene sequence</Form.Label>
                  <Form.Control
                    type="text"
                    name="partial16s_RNA_Gs"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="partial12s_RNA_Gs">
                  <Form.Label>Partial 12s rRNA gene sequence</Form.Label>
                  <Form.Control
                    type="text"
                    name="partial12s_RNA_Gs"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p></p>
            <Row></Row>
            <p></p>

            <Row>
              <Col>
                <Form.Group controlId="partial16s_RNA_Ss">
                  <Form.Label>Partial 16s rRNA short sequence</Form.Label>
                  <Form.Control
                    type="text"
                    name="partial16s_RNA_Ss"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="partial12s_RNA_Ss">
                  <Form.Label>Partial 12s rRNA short sequence</Form.Label>
                  <Form.Control
                    type="text"
                    name="partial12s_RNA_Ss"
                    required
                    style={{ border: "1px solid black" }}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="sub_name_designation">
                  <Form.Label>Submitted by Name&designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="sub_name_designation"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p></p>
            <Row>
              <Col>
                <Form.Group controlId="reference_id">
                  <Form.Label>Reference ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="reference_id"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
              </Col>
              <Col></Col>
              <Col></Col>
            </Row>
            <p></p>
            <Button
              variant="primary"
              type="submit"
              onClick={props.onHide}
              style={{ marginRight: "10px" }}
            >
              Add
            </Button>
            <Button variant="danger" type="submit" onClick={props.onHide}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddDnaModal;
