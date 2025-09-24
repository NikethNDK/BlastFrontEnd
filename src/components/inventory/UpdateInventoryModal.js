import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateInventoryApi } from '../../services/AppinfoService';

const UpdateInventoryModal = (props) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
    
        const inventoryData = {
            item_code: formData.get('itemCode'),
            item_name: formData.get('itemName'),
            tran_type_IR: formData.get('tranTypeIR'),
            qnty: formData.get('qnty'),
            ref_number: formData.get('refNumber'),
            ref_type: formData.get('refType'),
            batch_number: formData.get('batchNumber'),
            remarks: formData.get('remarks'),
            created_on: formData.get('createdOn'),
            created_by: formData.get('createdBy'),
            modified_on: formData.get('modifiedOn'),
            modified_by: formData.get('modifiedBy'),
            quantity_issued: formData.get('quantityIssued'),
            quantity_recieved: formData.get('quantityRecieved'),
            stock: formData.get('stock'),
            dev_remarks: formData.get('devRemarks'),
        };

      
        try {
          const result = await updateInventoryApi(props.inventory.entry_no, inventoryData);
          alert(result);
          props.setUpdated(true);
        } catch (error) {
          console.error('Failed to Update Inventory:', error);
          alert(`Failed to Update Inventory: ${error.message}`);
        }
      };

      
      
        return (
            <div className="container">
    
                <Modal
                    {...props}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered >
    
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Update Inventory Information
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <Form onSubmit={handleSubmit}>

                                  <Row>
                                    <Col>
                                     <Form.Group controlId="itemCode">
                                      <Form.Label>Item Code</Form.Label>
                                      <Form.Control type="text" name="itemCode" required defaultValue={props.inventory?.item_code || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>

                                    <Col>
                                     <Form.Group controlId="itemName">
                                      <Form.Label>Item Name</Form.Label>
                                      <Form.Control type="text" name="itemName" required defaultValue={props.inventory?.item_name || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>

                                    <Col>                            
                                    <Form.Group controlId="tranTypeIR">
                                      <Form.Label>Tran Type I/R</Form.Label>
                                      <Form.Control
                                          as="select"
                                          name="tranTypeIR"
                                          required
                                          defaultValue={props.inventory?.tran_type_IR || ''}
                                          className="custom-border"
                                      >
                                          <option value="" disabled>Select I/R</option>
                                          <option value="I">I</option>
                                          <option value="R">R</option>
                                      </Form.Control>
                                    </Form.Group>
                                    </Col>
                                    <Col>                            
                                    <Form.Group controlId="qnty">
                                      <Form.Label>Quantity</Form.Label>
                                      <Form.Control type="text" name="qnty" required defaultValue={props.inventory?.qnty || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>     
                                    <Col>                    
                                    <Form.Group controlId="refNumber">
                                      <Form.Label>Ref Number</Form.Label>
                                      <Form.Control type="text" name="refNumber" required defaultValue={props.inventory?.ref_number || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                  </Row>
                                  <p></p>

                                  <Row>  
                                    <Col>                            
                                    <Form.Group controlId="refType">
                                      <Form.Label>Ref Type</Form.Label>
                                      <Form.Control type="text" name="refType" required defaultValue={props.inventory?.ref_type || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    <Col>                            
                                    <Form.Group controlId="batchNumber">
                                      <Form.Label>Batch Number</Form.Label>
                                      <Form.Control type="text" name="batchNumber" required defaultValue={props.inventory?.batch_number || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>        
                                    <Col>                   
                                    <Form.Group controlId="remarks">
                                      <Form.Label>Remarks</Form.Label>
                                      <Form.Control type="text" name="remarks" required defaultValue={props.inventory?.remarks || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="createdOn">
                                      <Form.Label>Created On</Form.Label>
                                      <Form.Control type="text" name="createdOn" required defaultValue={props.inventory?.created_on || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="createdBy">
                                      <Form.Label>Created By</Form.Label>
                                      <Form.Control type="text" name="createdBy" required defaultValue={props.inventory?.created_by || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                  </Row>
                                  <p></p>

                                  <Row> 
                                    <Col>
                                    <Form.Group controlId="modifiedOn">
                                      <Form.Label>Modified On</Form.Label>
                                      <Form.Control type="text" name="modifiedOn" required defaultValue={props.inventory?.modified_on || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="modifiedBy">
                                      <Form.Label>Modified By</Form.Label>
                                      <Form.Control type="text" name="modifiedBy" required defaultValue={props.inventory?.modified_by || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>

                                    <Col>
                                    <Form.Group controlId="quantityIssued">
                                      <Form.Label>Quantity Issued</Form.Label>
                                      <Form.Control type="text" name="quantityIssued" required defaultValue={props.inventory?.quantity_issued || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    
                                    <Col>
                                    <Form.Group controlId="quantityRecieved">
                                      <Form.Label>Quantity Received</Form.Label>
                                      <Form.Control type="text" name="quantityRecieved" required defaultValue={props.inventory?.quantity_recieved || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="stock">
                                      <Form.Label>Stock</Form.Label>
                                      <Form.Control type="text" name="stock" required defaultValue={props.inventory?.stock || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                  </Row>
                                  <p></p>

                                  <Row>
                                    <Col>
                                    <Form.Group controlId="devRemarks">
                                      <Form.Label>Dev Remarks</Form.Label>
                                      <Form.Control type="text" name="devRemarks" required defaultValue={props.inventory?.dev_remarks || ''} placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    <Col></Col>
                                    <Col></Col>
                                    <Col></Col>
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

export default UpdateInventoryModal;
