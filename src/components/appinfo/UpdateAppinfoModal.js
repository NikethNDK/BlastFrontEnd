import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateAppinfo } from '../../services/AppinfoService';

const UpdateAppinfoModal = (props) => {
    const handleSubmit = async (e) => {
        e.preventDefault(); 
      
        const formData = new FormData(e.target);
    
        const appInfoData = {
            infovalue: formData.get('infovalue'),
            remarks: formData.get('remarks'),
            created_on: formData.get('createdOn'),
            created_by: formData.get('createdBy'),
            modified_on: formData.get('modifiedOn'),
            modified_by: formData.get('modifiedBy'),
            dev_remarks: formData.get('devRemarks'),
        };
      
        try {
          const result = await updateAppinfo(props.appinfo.infocode, appInfoData);
          alert(result);
          props.setUpdated(true);
        } catch (error) {
          console.error('Failed to Update Apinfo:', error);
          alert(`Failed to Update Appinfo: ${error.message}`);
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
                            Update Appinfo Information
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={10}>
                                <Form onSubmit={handleSubmit}>
                                  
                                  <Row>
                                    <Col>
                                    <Form.Group controlId="infovalue">
                                      <Form.Label>Info Value</Form.Label>
                                      <Form.Control type="text" name="infovalue" required defaultValue={props.appinfo?.infovalue || ''} placeholder="" style={{ border: '1px solid black' }} />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="remarks">
                                      <Form.Label>Remarks</Form.Label>
                                      <Form.Control type="text" name="remarks" required defaultValue={props.appinfo?.remarks || ''} placeholder="" style={{ border: '1px solid black' }} />
                                    </Form.Group>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col>
                                    <Form.Group controlId="createdOn">
                                      <Form.Label>Created On</Form.Label>
                                      <Form.Control type="text" name="createdOn" required defaultValue={props.appinfo?.created_on || ''} placeholder="" style={{ border: '1px solid black' }} />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="createdBy">
                                      <Form.Label>Created By</Form.Label>
                                      <Form.Control type="text" name="createdBy" required defaultValue={props.appinfo?.created_by || ''} placeholder="" style={{ border: '1px solid black' }} />
                                    </Form.Group>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col>
                                    <Form.Group controlId="modifiedOn">
                                      <Form.Label>Modified On</Form.Label>
                                      <Form.Control type="text" name="modifiedOn" required defaultValue={props.appinfo?.modified_on || ''} placeholder="" style={{ border: '1px solid black' }} />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="modifiedBy">
                                      <Form.Label>Modified By</Form.Label>
                                      <Form.Control type="text" name="modifiedBy" required defaultValue={props.appinfo?.modified_by || ''} placeholder="" style={{ border: '1px solid black' }} />
                                    </Form.Group>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col>
                                    <Form.Group controlId="devRemarks">
                                      <Form.Label>Dev Remarks</Form.Label>
                                      <Form.Control type="text" name="devRemarks" required defaultValue={props.appinfo?.dev_remarks || ''} placeholder="" style={{ border: '1px solid black' }} />
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

export default UpdateAppinfoModal;
