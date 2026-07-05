import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import {
  addEmployeeApi,
  getDistinctRoleApi,
  getProjectApi,
  getLabsApi,
  getUsersForAssignProjectApi,
} from "../../../services/AppinfoService";
import toast from "react-hot-toast";

const resetFormState = (setters) => {
  setters.setEmpId("");
  setters.setSelectedLab("");
  setters.setSelectedLabId(null);
  setters.setSelectedRole("");
  setters.setSelectedProjects([]);
  setters.setSelectedUsername("");
};

const AssignProjectModal = (props) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [empId, setEmpId] = useState("");

  useEffect(() => {
    getDistinctRoleApi()
      .then((data) => {
        setDesignations(
          data.map((item) => ({ value: item.role, label: item.role }))
        );
      })
      .catch((error) => console.error("Error fetching roles:", error));

    getProjectApi()
      .then((data) => {
        const activeProjects = data.filter((item) => item.deleted === 0);
        setProjects(
          activeProjects.map((item) => ({
            value: item.project_code,
            label: item.project_name,
          }))
        );
      })
      .catch((error) => console.error("Error fetching projects:", error));

    getLabsApi()
      .then((response) => {
        setLabs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching labs data", error);
      });
  }, []);

  useEffect(() => {
    if (selectedLab && selectedRole) {
      getUsersForAssignProjectApi(selectedLab, selectedRole)
        .then((users) => {
          const userList = Array.isArray(users) ? users : [users];
          setUsernames(
            userList.map((user) => user.emp_name).filter(Boolean)
          );
        })
        .catch((error) => {
          console.error("Error fetching users for assign project:", error);
          setUsernames([]);
        });
    } else {
      setUsernames([]);
      setSelectedUsername("");
    }
  }, [selectedLab, selectedRole]);

  const handleClose = () => {
    resetFormState({
      setEmpId,
      setSelectedLab,
      setSelectedLabId,
      setSelectedRole,
      setSelectedProjects,
      setSelectedUsername,
    });
    props.onHide();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const empData = {
      emp_id: formData.get("empId"),
      emp_name: formData.get("username"),
      designation: selectedRole,
      project_code: selectedProjects,
      lab_id: selectedLabId || labs.find((l) => l.name === selectedLab)?.id,
      role: selectedRole,
    };

    addEmployeeApi(empData)
      .then(() => {
        toast.success("Employee added successfully");
        props.setUpdated(true);
        handleClose();
      })
      .catch((error) => {
        console.error("Employee ID already exist", error);
        toast.error("Employee ID already exist.");
      });
  };

  const handleProjectChange = (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedProjects(selectedValues);
  };

  const usernamePlaceholder =
    !selectedLab || !selectedRole
      ? "Select lab and role first"
      : usernames.length === 0
        ? "No users available"
        : "Select username";

  return (
    <Modal
      {...props}
      onHide={handleClose}
      size="sm"
      scrollable
      centered
      backdrop="static"
      dialogClassName="project-modal project-modal--form"
      contentClassName="project-modal-content"
      aria-labelledby="assign-employee-modal-title"
    >
      <div className="project-modal-header">
        <button
          type="button"
          className="project-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes aria-hidden />
        </button>
        <h2 id="assign-employee-modal-title" className="project-modal-title">
          Assign employee
        </h2>
        <p className="project-modal-description">
          Link a user to a lab, role, and one or more projects.
        </p>
      </div>
      <Modal.Body className="project-modal-body">
        <Form onSubmit={handleSubmit} className="project-modal-form">
          <Form.Group controlId="empId" className="project-field">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              name="empId"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
              placeholder="Enter employee ID"
              autoComplete="off"
              className="project-field-input"
            />
          </Form.Group>

          <Form.Group controlId="lab" className="project-field">
            <Form.Label>Lab</Form.Label>
            <Form.Select
              name="lab"
              required
              value={selectedLab}
              onChange={(e) => {
                setSelectedLab(e.target.value);
                const selectedLabObj = labs.find(
                  (l) => l.name === e.target.value
                );
                setSelectedLabId(selectedLabObj ? selectedLabObj.id : null);
              }}
              className="project-field-input"
            >
              <option value="">Select lab</option>
              {labs.map((lab) => (
                <option key={lab.id} value={lab.name}>
                  {lab.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="designation" className="project-field">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="designation"
              required
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="project-field-input"
            >
              <option value="">Select role</option>
              {designations.map((designation) => (
                <option key={designation.value} value={designation.value}>
                  {designation.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="username" className="project-field">
            <Form.Label>Username</Form.Label>
            <Form.Select
              name="username"
              required
              value={selectedUsername}
              onChange={(e) => setSelectedUsername(e.target.value)}
              disabled={!selectedLab || !selectedRole}
              className={`project-field-input${
                !selectedLab || !selectedRole
                  ? " project-field-input--disabled"
                  : ""
              }`}
            >
              <option value="">{usernamePlaceholder}</option>
              {usernames.length > 0 && selectedLab && selectedRole
                ? usernames.map((username, index) => (
                    <option key={index} value={username}>
                      {username}
                    </option>
                  ))
                : null}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="project" className="project-field">
            <Form.Label>Projects</Form.Label>
            <Form.Select
              name="project"
              multiple
              onChange={handleProjectChange}
              value={selectedProjects}
              required
              className="project-field-input project-field-input--multiselect"
              aria-describedby="assign-project-hint"
            >
              {projects.map((proj) => (
                <option key={proj.value} value={proj.value}>
                  {proj.label}
                </option>
              ))}
            </Form.Select>
            <Form.Text id="assign-project-hint" className="project-field-hint">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple projects.
            </Form.Text>
          </Form.Group>

          <div className="project-modal-form-actions">
            <button
              type="button"
              className="project-btn project-btn-outline"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="project-btn project-btn-primary">
              Assign
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AssignProjectModal;
