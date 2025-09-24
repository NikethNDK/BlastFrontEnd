import React from 'react';
import {Modal, Col, Row, Form, Button} from 'react-bootstrap';
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { addIssueApi } from '../../services/AppinfoService';


const AddResearcherIssueTask = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
    
        const IssueData = {
            researcher_name: formData.get('researcherName'),
            issues_task: formData.get('issuesTask'),
            issue_raised_by: formData.get('issueRaisedBy'),
            issue_status: formData.get('issueStatus'),
        };
    
        addIssueApi(IssueData)
            .then((result) => {
                window.alert("Data added successfully");
                props.setUpdated(true);
            })
            .catch((error) => {
            console.error("Failed to Add Issues", error);  // Log the error to the console
            alert("Failed to Add Issues. Check console for details.");
            });
    };

    return(
        <div className="container">

            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered >

                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={11}>
                            <Form onSubmit={handleSubmit}>

                            <Row>
                                <Col>
                                <Form.Group controlId="researcherName">
                                    <Form.Label>Researcher Name</Form.Label>
                                    <Form.Control type="text" name="researcherName" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group controlId="issuesTask">
                                  <Form.Label>Issues Task</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="issuesTask"
                                    required
                                    placeholder=""
                                    style={{ border: '1px solid black' }}
                                  />
                                </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                <Form.Group controlId="issueRaisedBy">
                                  <Form.Label>Issue Raised By</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="issueRaisedBy"
                                    required
                                    style={{ border: '1px solid black' }}
                                  >
                                    <option value="Lab Assistant">Lab Assistant</option>
                                    <option value="Reseacher">Researcher</option>
                                  </Form.Control>
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group controlId="issueStatus">
                                    <Form.Label>Issue Status</Form.Label>
                                    <Form.Control type="text" name="issueStatus" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <p></p>
                                <Button variant="primary" type="submit" onClick={props.onHide} style={{marginRight: '8px'}}>
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
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AddResearcherIssueTask;