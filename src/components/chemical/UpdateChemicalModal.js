import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateChemicalApi } from '../../services/AppinfoService';

const UpdateChemicalModal = (props) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
    
        const masterData = {
          entry_no: formData.get('entryNo'),
          item_code: formData.get('itemCode'),
          item_name: formData.get('itemName'),
          m_date: formData.get('date'),
          supplier: formData.get('supplier'),
          master_type: formData.get('masterType'),
          quantity: formData.get('quantity'),
          units: formData.get('units'),
          price: formData.get('price'),
          project_code: formData.get('projectCode'),
          remarks: formData.get('remarks'),
      };
      
        try {
          const result = await updateChemicalApi(props.chemical.c_id, masterData);
          alert("Updated Successfully");
          props.setUpdated(true);
        } catch (error) {
          console.error('Failed to Update Chemical:', error);
          alert(`Failed to Update Chemical: ${error.message}`);
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
                            Update Inventory Form
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <Form onSubmit={handleSubmit}>
                                <Row>
                                  <Col>
                                   <Form.Group controlId="entryNo">
                                    <Form.Label>Entry No.</Form.Label>
                                    <Form.Control type="text" name="entryNo" required defaultValue={props.chemical?.entry_no || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="itemCode">
                                    <Form.Label>Item Code</Form.Label>
                                    <Form.Control type="text" name="itemCode" required defaultValue={props.chemical?.item_code || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="itemName">
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control type="text" name="itemName" required defaultValue={props.chemical?.item_name || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                </Row>
                                <p></p>

                                <Row>
                                  <Col>
                                  <Form.Group controlId="date">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="text" name="date" required defaultValue={props.chemical?.m_date || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="supplier">
                                    <Form.Label>Supplier</Form.Label>
                                    <Form.Control type="text" name="supplier" required defaultValue={props.chemical?.supplier || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="master_type">
                                    <Form.Label>Master Type</Form.Label>
                                    <Form.Control type="text" name="masterType" required defaultValue={props.chemical?.master_type || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                </Row>
                                <p></p>

                                <Row>                                  
                                  <Col>
                                  <Form.Group controlId="quantity">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control type="text" name="quantity" required defaultValue={props.chemical?.quantity || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="units">
                                    <Form.Label>Units</Form.Label>
                                    <Form.Control type="text" name="units" required defaultValue={props.chemical?.units || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="text" name="price" required defaultValue={props.chemical?.price || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>                                  
                                </Row>

                                <Row>
                                  <Col>
                                  <Form.Group controlId="projectCode">
                                    <Form.Label>Project Code</Form.Label>
                                    <Form.Control type="text" name="projectCode" required defaultValue={props.chemical?.project_code || ''} placeholder="" style={{ border: '1px solid black' }} />
                                  </Form.Group>
                                  </Col>
                                  <Col>
                                  <Form.Group controlId="remarks">
                                    <Form.Label>Remarks</Form.Label>
                                    <Form.Control type="text" name="remarks" required defaultValue={props.chemical?.remarks || ''} placeholder="" style={{ border: '1px solid black' }} />
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

export default UpdateChemicalModal;
