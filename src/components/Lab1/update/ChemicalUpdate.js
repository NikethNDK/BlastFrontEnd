import React from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateLAbMasterApi } from '../../../services/AppinfoService';

const ChemicalUpdate = (props) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log(props.chemical); // Log props.chemical to inspect its structure and values
    
        const formData = new FormData(e.target);
    
        const chemicalData = {
            master_type: formData.get('masterType'),
            item_code: formData.get('itemCode'),
            item_name: formData.get('itemName'),
            location_code: formData.get('locationCode'),
            units: formData.get('units'),
            price: formData.get('price'),
            make: formData.get('make'),
            instruction_specification: formData.get('instructionSpecification'),
            min_req_stock: formData.get('minReqStock'),        
            remarks: formData.get('remarks')
        };
    
        try {
            const result = await updateLAbMasterApi(props.chemical?.c_id, chemicalData); // Use optional chaining to avoid errors if props.chemical is undefined
            props.setUpdated(true);
            alert("Updated Successfully");
        } catch (error) {
            console.error('Failed to Update Chemical: ', error);
            alert(`Failed to Update Chemical: ${error.message}`);
        }
    };
    

    return (
        <div className='container'>
            <Modal 
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Update Chemical Informatiom
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={11}>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId='masterType'>
                                                <Form.Label>Master Type</Form.Label>
                                                <Form.Control type="text" name="masterType" required defaultValue={props.chemical?.master_type || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col></Col>
                                        <Col></Col>
                                    </Row>
                                    <br />

                                    <Row>
                                        <Col>
                                            <Form.Group controlId='itemCode'>
                                                <Form.Label>Item Code</Form.Label>
                                                <Form.Control type="text" name="itemCode" required defaultValue={props.chemical?.item_code || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='itemName'>
                                                <Form.Label>Item Name</Form.Label>
                                                <Form.Control type="text" name="itemName" required defaultValue={props.chemical?.item_name || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='locationCode'>
                                                <Form.Label>Location Code</Form.Label>
                                                <Form.Control type="text" name="locationCode" required defaultValue={props.chemical?.location_code || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <p></p>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId='units'>
                                                <Form.Label>Units</Form.Label>
                                                <Form.Control type="text" name="units" required defaultValue={props.chemical?.units || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='price'>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control type="text" name="price" required defaultValue={props.chemical?.price || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='make'>
                                                <Form.Label>Make</Form.Label>
                                                <Form.Control type="text" name="make" required defaultValue={props.chemical?.make || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <p></p>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId='instructionSpecification'>
                                                <Form.Label>Instruction/ Specification</Form.Label>
                                                <Form.Control type="text" name="instructionSpecification" required defaultValue={props.chemical?.instruction_specification || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='minReqStock'>
                                                <Form.Label>Min Req Stock</Form.Label>
                                                <Form.Control type="text" name="minReqStock" required defaultValue={props.chemical?.min_req_stock || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='remarks'>
                                                <Form.Label>Remarks</Form.Label>
                                                <Form.Control type="text" name="remarks" required defaultValue={props.chemical?.remarks || ''} placeholder='' style={{ border: '1px solid black' }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <p></p>

                                    <Form.Group>
                                        <p></p>
                                        <Button variant='primary' type='submit' onClick={props.onHide}>
                                            Submit
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
        </div>
    );
};

export default ChemicalUpdate;