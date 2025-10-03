import React, { useState, useEffect } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
import {
  addEmployeeApi,
  getDistinctRoleApi,
  getProjectApi,
  getLabsApi,
  fetchUsernames,
} from "../../../services/AppinfoService";
import toast from "react-hot-toast";

const AssignProjectModal = (props) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [empId, setEmpId] = useState("");

  useEffect(() => {
    // Fetch roles (designations)
    getDistinctRoleApi()
      .then((data) => {
        setDesignations(
          data.map((item) => ({ value: item.role, label: item.role }))
        );
      })
      .catch((error) => console.error("Error fetching roles:", error));

    // Fetch projects and filter only active ones (based on deleted field from ProjectManage)
    getProjectApi()
      .then((data) => {
        console.log("All Projects:", data); // Log full response to check structure

        const activeProjects = data.filter((item) => item.deleted === 0); // Filter only active projects

        console.log("Active Projects:", activeProjects); // Log filtered response to verify

        setProjects(
          activeProjects.map((item) => ({
            value: item.project_code,
            label: item.project_name,
          }))
        );
      })
      .catch((error) => console.error("Error fetching projects:", error));

    // Fetch labs
    getLabsApi()
      .then((response) => {
        setLabs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching labs data", error);
      });

    if (selectedLab && selectedRole) {
      fetchUsernames(selectedLab, selectedRole)
        .then((data) => {
          setUsernames(data);
        })
        .catch((error) => console.error("Error fetching usernames:", error));
    }
  }, [selectedLab, selectedRole]); // Empty dependency array ensures this runs once when the component mounts

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const empData = {
      emp_id: formData.get("empId"),
      emp_name: formData.get("username"),
      designation: selectedRole,
      project_code: selectedProjects,
      // project_code: Array.isArray(selectedProjects) ? selectedProjects : [],
      // project_code: formData.get("project"),
      // lab_id: selectedLab,
      // designation_id: designations.find((d) => d.value === selectedRole)?.id,
      lab_id: labs.find((l) => l.name === selectedLab)?.id,
      role: selectedRole,
    };

    addEmployeeApi(empData)
      .then(() => {
        toast.success("Employee added successfully");
        props.setUpdated(true);
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

  return (
    <div className="container">
      <Modal {...props} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12}>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group controlId="empId">
                      <Form.Label>Employee ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="empId"
                        value={empId}
                        onChange={(e) => setEmpId(e.target.value)}
                        required
                        placeholder="Enter Employee ID"
                        style={{ border: "1px solid black" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="lab">
                      <Form.Label>Lab</Form.Label>
                      <Form.Control
                        as="select"
                        name="lab"
                        required
                        onChange={(e) => setSelectedLab(e.target.value)} // Update selected lab
                        style={{ border: "1px solid black" }}
                      >
                        <option value="">Select Lab</option>
                        {labs.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="designation">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        as="select"
                        name="designation"
                        required
                        onChange={(e) => setSelectedRole(e.target.value)} // Update selected role
                        style={{ border: "1px solid black" }}
                      >
                        <option value="">Select Role</option>
                        {designations.map((designation) => (
                          <option
                            key={designation.value}
                            value={designation.value}
                          >
                            {designation.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        as="select"
                        name="username"
                        required
                        style={{ border: "1px solid black" }}
                      >
                        <option value="">Select Username</option>
                        {/* {usernames.map((username, index) => (
                          <option key={index} value={username}>
                            {username}
                          </option>
                        ))} */}
                        {usernames && usernames.length > 0 ? (
                          usernames.map((username, index) => (
                            <option key={index} value={username}>
                              {username}
                            </option>
                          ))
                        ) : (
                          <option value="">No Users Available</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="project">
                      <Form.Label>Select Project</Form.Label>
                      <Form.Control
                        as="select"
                        name="project"
                        multiple
                        onChange={handleProjectChange}
                        value={selectedProjects}
                        required
                        style={{ border: "1px solid black" }}
                      >
                        {projects.map((proj) => (
                          <option key={proj.value} value={proj.value}>
                            {proj.label}
                          </option>
                        ))}
                      </Form.Control>

                      {/* <Form.Control
                        as="select"
                        name="project"
                        multiple
                        onChange={handleProjectChange}
                        required
                        style={{ border: "1px solid black" }}
                      >
                        <option value="">Select Project</option>
                        {projects.map((proj) => (
                          <option key={proj.value} value={proj.value}>
                            {proj.label}
                          </option>
                        ))}
                      </Form.Control> */}
                    </Form.Group>
                  </Col>
                </Row>
                <p></p>
                <Button variant="primary" type="submit">
                  Assign Project
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AssignProjectModal;
