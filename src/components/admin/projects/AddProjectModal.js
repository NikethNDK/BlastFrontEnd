import React, { useEffect, useState } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { addProjectApi } from "../../../services/AppinfoService";
import toast from "react-hot-toast";

const AddProjectModal = (props) => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const projectData = {
      project_name: formData.get("projectName"),
      project_code: formData.get("projectCode"),
    };

    addProjectApi(projectData)
      .then((result) => {
        toast.success("Project added successfully");
        setShowModal(false);
        // Toggle the updated state to trigger refetch
        props.setUpdated((prev) => !prev);
        props.onHide();
      })
      .catch((error) => {
        console.error("Failed to Add Project Data", error);

        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error); // Show duplicate error message
        } else {
          toast.error("Project code already exist.");
        }
      });
  };

  return (
    <div className="container">
      <Modal
        onHide={() => setShowModal(false)}
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Project Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={11}>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="projectCode">
                  <Form.Label>Project Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectCode"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>
                <Form.Group controlId="projectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    required
                    placeholder=""
                    style={{ border: "1px solid black" }}
                  />
                </Form.Group>

                <Form.Group>
                  <p></p>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ marginRight: "8px" }}
                  >
                    Add
                  </Button>
                  <Button variant="danger" type="button" onClick={props.onHide}>
                    Cancel
                  </Button>
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

export default AddProjectModal;