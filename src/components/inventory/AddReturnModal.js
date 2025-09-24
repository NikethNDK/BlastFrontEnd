import React, { useEffect, useState } from 'react';
import {Modal, Col, Row, Form, Button} from 'react-bootstrap';
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { addItemReturnApi, getMasterApi } from '../../services/AppinfoService';
import './formBorder.css';
import Select from 'react-select';

const AddReturnModal = (props) => {
    const [itemsCodes, setItemsCodes] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        // Fetch project codes
        getMasterApi()
            .then(data => {
                setItemsCodes(data.map(item => ({ value: item.c_id, label: item.item_code })));
            })
            .catch(error => console.error('Error fetching project codes:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        const formData = new FormData(e.target);
        
        const returnData = {
            c_id: selectedItem.value,
            quantity_return: formData.get('quantityReturn'),
        };
        
        addItemReturnApi(returnData)
        .then((result) => {
            window.alert("Data Return successfully");
            props.setUpdated(true);
            setSelectedItem(null); // Clear selected item
            props.onHide(); // Close the modal
        })
        .catch((error) => {
            console.error("Failed to Retun Data", error);  // Log the error to the console
            alert("Failed to Return.");
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
                        Item Return Form
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={10}>
                            <Form onSubmit={handleSubmit}>

                                <Row>
                                    <Col>                          
                                    <Form.Group controlId="itemCode">
                                            <Form.Label>Item Code</Form.Label>
                                    <Select
                                        options={itemsCodes}
                                        value={selectedItem}
                                        onChange={setSelectedItem}
                                        placeholder="Select Item Code"
                                    />
                                            {/*<Form.Control type='text' as="select" name="itemCode" required style={{ border: '1px solid black' }}>
                                                {itemsCodes.map((itemCode, index) => (
                                                    <option key={index} value={itemCode.value}>{itemCode.label}</option>
                                                ))}
                                                </Form.Control> */}
                                    </Form.Group>
                                    </Col>

                                    <Col>
                                    <Form.Group controlId="quantityReturn">
                                        <Form.Label>Quantity Return</Form.Label>
                                        <Form.Control type="type" name="quantityReturn" required placeholder="Enter Numeric Value" className="custom-border">
                                        </Form.Control>
                                    </Form.Group>
                                    </Col>
                                </Row>

                            <Form.Group>
                                <p></p>
                                <Button variant="primary" type="submit" onClick={props.onHide} style={{ width: '70px' }}>
                                    Save
                                </Button>
                                <Button variant="danger" type="submit" onClick={props.onHide} style={{ marginLeft: '10px'}}>
                                    Cancel
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

export default AddReturnModal;