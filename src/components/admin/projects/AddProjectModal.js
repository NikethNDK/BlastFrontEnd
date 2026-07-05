import React from "react";
import { Modal, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { addProjectApi } from "../../../services/AppinfoService";
import toast from "react-hot-toast";

const AddProjectModal = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const projectData = {
      project_name: formData.get("projectName"),
      project_code: formData.get("projectCode"),
    };

    addProjectApi(projectData)
      .then(() => {
        toast.success("Project added successfully");
        props.setUpdated((prev) => !prev);
        props.onHide();
      })
      .catch((error) => {
        console.error("Failed to Add Project Data", error);

        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Project code already exists.");
        }
      });
  };

  return (
    <Modal
      {...props}
      onHide={props.onHide}
      size="sm"
      scrollable
      centered
      backdrop="static"
      dialogClassName="project-modal"
      contentClassName="project-modal-content"
      aria-labelledby="add-project-modal-title"
    >
      <div className="project-modal-header">
        <button
          type="button"
          className="project-modal-close"
          onClick={props.onHide}
          aria-label="Close"
        >
          <FaTimes aria-hidden />
        </button>
        <h2 id="add-project-modal-title" className="project-modal-title">
          Add project
        </h2>
        <p className="project-modal-description">
          Create a new project for your lab workspace.
        </p>
      </div>
      <Modal.Body className="project-modal-body">
        <Form onSubmit={handleSubmit} className="project-modal-form">
          <Form.Group controlId="projectCode" className="project-field">
            <Form.Label>Project code</Form.Label>
            <Form.Control
              type="text"
              name="projectCode"
              required
              placeholder="PRJ-001"
              autoComplete="off"
              className="project-field-input"
            />
          </Form.Group>
          <Form.Group controlId="projectName" className="project-field">
            <Form.Label>Project name</Form.Label>
            <Form.Control
              type="text"
              name="projectName"
              required
              placeholder="Enter project name"
              autoComplete="off"
              className="project-field-input"
            />
          </Form.Group>
          <div className="project-modal-form-actions">
            <button
              type="button"
              className="project-btn project-btn-outline"
              onClick={props.onHide}
            >
              Cancel
            </button>
            <button type="submit" className="project-btn project-btn-primary">
              Create
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProjectModal;
