import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
//import { updateChemicalApi } from '../services/AppinfoService';
import { updateProjectApi } from '../../../services/AppinfoService'

const UpdateProjectModal = (props) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
    
        const projectData = {
            project_name: formData.get('projectName')
        };
      
        try {
          const result = await updateProjectApi(props.project.project_code, projectData);
          alert(result);
          props.setUpdated(true);
        } catch (error) {
          console.error('Failed to Update Project:', error);
          alert(`Failed to Update Project: ${error.message}`);
        }
      };

      
      
        return (
            <div className="container">
    
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered >
    
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Update Project Information
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={handleSubmit}>
                 <Form.Group controlId="projectName">
                  <Form.Label>Project Name.</Form.Label>
                  <Form.Control type="text" name="projectName" required defaultValue={props.project?.project_name || ''} placeholder="" style={{ border: '1px solid black' }} />
                </Form.Group>
                <Form.Group>
                  <p></p>
                  <Button variant="primary" type="submit" onClick={props.onHide}>
                                    Submit
                                </Button>
                            </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" type="submit" onClick={props.onHide}>
                        Close
                </Button>

                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UpdateProjectModal;
