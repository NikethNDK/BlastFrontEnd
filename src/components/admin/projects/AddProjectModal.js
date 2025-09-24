import React, { useEffect, useState } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { addProjectApi } from "../../../services/AppinfoService";

const AddProjectModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     const formData = new FormData(e.target);

  //     const projectData = {
  //       project_name: formData.get("projectName"),
  //     };

  //     addProjectApi(projectData)
  //       .then((result) => {
  //         window.alert("Data added successfully");
  //         props.setUpdated(true);
  //       })
  //       .catch((error) => {
  //         console.error("Failed to Add Project Data", error); // Log the error to the console
  //         alert("Failed to Add Project. Check console for details.");
  //       });
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const projectData = {
      project_name: formData.get("projectName"),
      project_code: formData.get("projectCode"),
    };

    addProjectApi(projectData)
      .then((result) => {
        alert("Project added successfully");
        setShowModal(false);
        props.setUpdated(true);
      })
      .catch((error) => {
        console.error("Failed to Add Project Data", error);

        if (error.response && error.response.data.error) {
          alert(error.response.data.error); // Show duplicate error message
        } else {
          alert("Project code already exist.");
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
                    onClick={props.onHide}
                    style={{ marginRight: "8px" }}
                  >
                    Add
                  </Button>
                  <Button variant="danger" type="submit" onClick={props.onHide}>
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
