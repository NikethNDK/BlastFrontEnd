import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateRequestApi } from '../../services/AppinfoService';

const AdminApprovalModal = (props) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
    
        const approvalData = {
            ItemCode: formData.get('itemCode'),
            ItemType: formData.get('itemType'),
            ItemName: formData.get('itemName'),
            RequestDate: formData.get('requestDate'),
            RequestStatus: formData.get('requestStatus'),
            RequestedBy: formData.get('requestedBy'),
            RequestDetails: formData.get('requestDetails'),
            ApprovedBy: formData.get('approvedBy'),
        };
      
        try {
          const result = await updateRequestApi(props.request.id, approvalData);
          alert("Approval Updated Successfully");
          props.setUpdated(true);
        } catch (error) {
          console.error('Failed to Update Approval:', error);
          alert(`Failed to Update Approval: ${error.message}`);
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
                            Approval Form
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <Form onSubmit={handleSubmit}>
                                <Row>
                                  <Col>
                                   <Form.Group controlId="itemCode">
                                    <Form.Label>Item code</Form.Label>
                                    <Form.Control type="text" name="itemCode" required defaultValue={props.request?.ItemCode || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="itemType">
                                    <Form.Label>Item Type</Form.Label>
                                    <Form.Control type="text" name="itemType" required defaultValue={props.request?.ItemType || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="itemName">
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control type="text" name="itemName" required defaultValue={props.request?.ItemName || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                </Row>
                                <p></p>

                                <Row> 
                                  <Col>
                                  <Form.Group controlId="requestDate">
                                    <Form.Label>Request Date</Form.Label>
                                    <Form.Control type="text" name="requestDate" required defaultValue={props.request?.RequestDate || ''} placeholder="" style={{ border: '1px solid black' }} />
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
                                        <option value="Waiting for Approval">Waiting for Approval</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
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
                                  <Col>
                                  <Form.Group controlId="approvedBy">
                                    <Form.Label>Approved By</Form.Label>
                                    <Form.Control type="text" name="approvedBy" required defaultValue={'Manager'} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col></Col>
                                </Row>

                                
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

export default AdminApprovalModal;
