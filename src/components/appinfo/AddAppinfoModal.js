import React from 'react';
import {Modal, Col, Row, Form, Button} from 'react-bootstrap';
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { addAppinfo } from '../../services/AppinfoService';


const AddAppinfoModal = (props) => {

    const handleSubmit = (e) => {
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
    
        addAppinfo(appInfoData)
            .then((result) => {
                window.alert("Data added successfully");
                props.setUpdated(true);
            })
            .catch((error) => {
            console.error("Failed to Add Appinfo", error);  // Log the error to the console
            alert("Failed to Add Appinfo. Check console for details.");
            });
    };

    return(
        <div className="container">

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >

                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Fill In Appinfo Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={10}>
                            <Form onSubmit={handleSubmit}>

                            <Row>
                                <Col>
                                <Form.Group controlId="infovalue">
                                    <Form.Label>Info Vlaue</Form.Label>
                                    <Form.Control type="text" name="infovalue" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group controlId="remarks">
                                    <Form.Label>Remarks</Form.Label>
                                    <Form.Control type="text" name="remarks" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                <Form.Group controlId="createdOn">
                                    <Form.Label>Created On</Form.Label>
                                    <Form.Control type="text" name="createdOn" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group controlId="createdBy">
                                    <Form.Label>Created By</Form.Label>
                                    <Form.Control type="text" name="createdBy" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                <Form.Group controlId="modifiedOn">
                                    <Form.Label>Modified On</Form.Label>
                                    <Form.Control type="text" name="modifiedOn" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                                <Col>
                                <Form.Group controlId="modifiedBy">
                                    <Form.Label>Modified By</Form.Label>
                                    <Form.Control type="text" name="modifiedBy" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                <Form.Group controlId="devRemarks">
                                    <Form.Label>Dev Remarks</Form.Label>
                                    <Form.Control type="text" name="devRemarks" required placeholder="" style={{ border: '1px solid black' }} />
                                </Form.Group>
                                </Col>
                                <Col></Col>
                            </Row>
                            <Form.Group>
                                <p></p>
                                <Button variant="primary" type="submit" onClick={props.onHide}>
                                    Add
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

export default AddAppinfoModal;