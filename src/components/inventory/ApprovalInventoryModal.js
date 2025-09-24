import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { addRequestApi } from '../../services/AppinfoService';

const ApprovalInventoryModal = (props) => {
  const { readOnly } = props;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract values from the form
    const formData = new FormData(e.target);

    const approvalData = {
      ItemCode: formData.get('itemCode'),
      ItemType: formData.get('itemType'),
      ItemName: formData.get('itemName'),
      RequestDate: formData.get('requestDate'),
      RequestStatus: formData.get('requestStatus'),
      RequestedBy: formData.get('requestedBy'),
      RequestDetails: formData.get('requestDetails'),
    };

    // Pass the extracted data to addRequestApi
    addRequestApi(approvalData)
      .then((result) => {
        window.alert('Request Sent successfully');
        props.setUpdated(true);
      })
      .catch((error) => {
        alert('Failed to Request');
      });
  };

  return (
    <div className="container">
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Request Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12}>
              <Form onSubmit={handleSubmit}>
                {/* ... (other form fields) */}
                <Row>
                  {/* ... (other form fields) */}
                  <Col>
                    <Form.Group controlId="itemCode">
                      <Form.Label>Item Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemCode"
                        required
                        defaultValue={props.itemCode} // use props.itemCode as the default value
                        placeholder=""
                        style={{ border: '1px solid black' }}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="itemType">
                      <Form.Label>Item Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemType"
                        required
                        defaultValue={'Inventory'}
                        placeholder=""
                        style={{ border: '1px solid black' }}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                  <Form.Group controlId="itemName">
                      <Form.Label>Item Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemName"
                        required
                        defaultValue={props.itemName} // use props.itemName as the default value
                        placeholder=""
                        style={{ border: '1px solid black' }}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <p></p>

                <Row>
                  <Col>
                    <Form.Group controlId="requestDate">
                      <Form.Label>Request Date</Form.Label>
                      <Form.Control
                        type="text"
                        name="requestDate"
                        required
                        defaultValue={new Date().toISOString().slice(0, 10)}
                        placeholder=""
                        style={{ border: '1px solid black' }}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="requestStatus">
                      <Form.Label>Request Status</Form.Label>
                      <Form.Control
                        type="text"
                        name="requestStatus"
                        required
                        defaultValue={'Waiting For Approval'}
                        placeholder=""
                        style={{ border: '1px solid black' }}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="requestedBy">
                      <Form.Label>Requested By</Form.Label>
                      <Form.Control
                        type="text"
                        name="requestedBy"
                        required
                        defaultValue={'Lab Assistant'}
                        placeholder=""
                        style={{ border: '1px solid black' }}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <p></p>
                <Row>                  
                <Col>
                    <Form.Group controlId="requestDetails">
                      <Form.Label>Request Details</Form.Label>
                      <Form.Control
                        type="text"
                        name="requestDetails"
                        required
                        defaultValue={`Can I update ${props.itemCode ? props.itemCode : 'record'} record?`}
                        placeholder=""
                        style={{ border: '1px solid black' }}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col></Col>
                  <Col></Col>
                </Row>

                <Form.Group>
                  <p></p>
                  <Button variant="primary" type="submit" onClick={props.onHide} disabled={readOnly}>
                    Send
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

export default ApprovalInventoryModal;
