import React from "react";
import { Modal, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { updateProjectApi } from "../../../services/AppinfoService";
import toast from "react-hot-toast";

const UpdateProjectModal = (props) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const projectData = {
      project_name: formData.get("projectName"),
    };

    try {
      const result = await updateProjectApi(
        props.editProjects.project_code,
        projectData
      );
      toast.success(result);
      props.setUpdated((prev) => !prev);
      props.onHide();
    } catch (error) {
      console.error("Failed to Update Project:", error);
      toast.error(`Failed to update project: ${error.message}`);
    }
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
      aria-labelledby="update-project-modal-title"
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
        <h2 id="update-project-modal-title" className="project-modal-title">
          Edit project
        </h2>
        <p className="project-modal-description">
          Update the project name. Code cannot be changed.
        </p>
      </div>
      <Modal.Body className="project-modal-body">
        <Form onSubmit={handleSubmit} className="project-modal-form">
          <Form.Group controlId="projectCodeDisplay" className="project-field">
            <Form.Label>Project code</Form.Label>
            <div className="project-field-input-wrap--readonly">
              <Form.Control
                type="text"
                value={props.editProjects?.project_code || ""}
                disabled
                readOnly
                className="project-field-input"
              />
            </div>
          </Form.Group>
          <Form.Group controlId="projectName" className="project-field">
            <Form.Label>Project name</Form.Label>
            <Form.Control
              type="text"
              name="projectName"
              required
              defaultValue={props.editProjects?.project_name || ""}
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
              Save changes
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProjectModal;
