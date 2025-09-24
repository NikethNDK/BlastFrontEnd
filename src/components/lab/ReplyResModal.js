import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateProductApi } from '../../services/AppinfoService';

const ReplyResModal = (props) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
    
        const resData = {
            RequestedTo: formData.get('requestedTo'),
            RequestStatus: formData.get('requestStatus'),
            RequestedBy: formData.get('requestedBy'),
            RequestDetails: formData.get('requestDetails'),
        };
      
        try {
          const result = await updateProductApi(props.request.id, resData);
          alert("Response Sended");
          props.setUpdated(true);
        } catch (error) {
          console.error('Failed to Update:', error);
          alert(`Failed to Update: ${error.message}`);
        }
      };
      console.log('Props Request:', props.request);


      
      
        return (
            <div className="container">
    
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered >
    
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Response Form
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <Form onSubmit={handleSubmit}>
                                <Row>
                                  <Col>
                                  <Form.Group controlId="requestedTo">
                                    <Form.Label>Request To</Form.Label>
                                    <Form.Control type="text" name="requestedTo" required defaultValue={props.request?.RequestedTo || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group controlId="requestStatus">
                                      <Form.Label>Request Status</Form.Label>
                                      <Form.Select
                                        name="requestStatus"
                                        required
                                        defaultValue={props.request?.RequestStatus || ''}
                                        style={{ border: '1px solid black' }}
                                      >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </Form.Select>
                                    </Form.Group>
                                  </Col>                                 
                                  <Col>
                                  <Form.Group controlId="requestedBy">
                                    <Form.Label>Requested By</Form.Label>
                                    <Form.Control type="text" name="requestedBy" required defaultValue={props.request?.RequestedBy || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                </Row>
                                <p></p>

                                <Row>                                  
                                <Col>
                                  <Form.Group controlId="requestDetails">
                                    <Form.Label>Request Details</Form.Label>
                                    <Form.Control type="text" name="requestDetails" required defaultValue={props.request?.RequestDetails || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col></Col>
                                  <Col></Col>
                                </Row>

                                
                                <Form.Group>
                                  <p></p>
                                  <Button variant="primary" type="submit" onClick={props.onHide} style={{marginRight: '10px'}}>
                                    Submit
                                  </Button>
                                  <Button variant="danger" type="submit" onClick={props.onHide}>
                                          Close
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

export default ReplyResModal;
