import React, { useState, useEffect } from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateEmployeeApi, getLoginApi, getProjectApi } from '../../../services/AppinfoService';

const UpdateEmployeeModal = (props) => {
    const [designations, setDesignations] = useState([]);
    const [projectCodes, setProjectCodes] = useState([]);

    useEffect(() => {
        // Fetch designations
        getLoginApi()
            .then(data => {
                setDesignations(data.map(item => ({ value: item.role, label: item.role })));
            })
            .catch(error => console.error('Error fetching designations:', error));

        // Fetch project codes
        getProjectApi()
            .then(data => {
                setProjectCodes(data.map(item => ({ value: item.project_code, label: item.project_name })));
            })
            .catch(error => console.error('Error fetching project codes:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
    
        const empData = {
            empName: formData.get('empName'),
            designation: formData.get('designation'),
            project_code: formData.get('projectCode')
        };
      
        try {
            // Call the updateEmployeeApi with empData and employee ID
            const result = await updateEmployeeApi(props.employee.emp_id, empData);
            alert(result);
            // Set updated to true to trigger a re-render of the employee list
            props.setUpdated(true);
        } catch (error) {
            console.error('Failed to Update Employee:', error);
            alert(`Failed to Update Employee: ${error.message}`);
        }
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
                        Update Employee Form
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={11}>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                <Form.Group controlId="empName">
                                    <Form.Label>Employee Name</Form.Label>
                                    <Form.Control type="text" name="empName" required defaultValue={props.employee?.emp_name || ''} placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group controlId="designation">
                                    <Form.Label>Designation</Form.Label>
                                    <Form.Control as="select" name="designation" required defaultValue={props.employee?.designation || ''} style={{ border: '1px solid black' }}>
                                        {designations.map((designation, index) => (
                                            <option key={index} value={designation.value}>{designation.label}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group controlId="projectCode">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control as="select" name="projectCode" required defaultValue={props.employee?.project_code || ''} style={{ border: '1px solid black' }}>
                                        {projectCodes.map((projectCode, index) => (
                                            <option key={index} value={projectCode.value}>{projectCode.label}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                </Col>
                                </Row>
                                <p></p>
                                <Button variant="primary" type="submit" onClick={props.onHide}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UpdateEmployeeModal;
