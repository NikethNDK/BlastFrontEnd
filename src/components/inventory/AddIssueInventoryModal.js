import React, { useEffect, useState } from 'react';
import {Modal, Col, Row, Form, Button} from 'react-bootstrap';
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { addItemIssueApi, getMasterApi, getProjectApi, getResEmployeeApi } from '../../services/AppinfoService';
import './formBorder.css';
import Select from 'react-select';

const AddIssueInventoryModal = (props) => {
    const [itemsCodes, setItemsCodes] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [projectCodes, setProjectCodes] = useState([]);
    const [selectedCodes, setSelectedCodes] = useState(null);
    
    const [resNames, setResNames] = useState([]);
    const [selectedNames, setSelectedNames] = useState(null);

    useEffect(() => {
        getMasterApi()
            .then(data => {
                setItemsCodes(data.map(item => ({ value: item.c_id, label: item.item_code })));
            })
            .catch(error => console.error('Error fetching item codes:', error));
            
            //Fetch Projects codes
            getProjectApi()
            .then(data => {
                setProjectCodes(data.map(item => ({ value: item.project_code, label: item.project_name })));
            })
            .catch(error => console.error('Error fetching project codes:', error));

            //Fetch Projects codes
            getResEmployeeApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setResNames(data.map(item => ({ value: item, label: item })));
            })
            .catch(error => console.error('Error fetching Researcher Names:', error));
    
    }, []);

    console.log("Researched Names:", resNames); // Log state to verify

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
    
        const issueData = {
            c_id: selectedItem.value,
            quantity_issued: formData.get('quantityIssued'),
            issued_to: formData.get('issuedTo'),
            project_code: selectedCodes.value,
            researcher_name: selectedNames.value,
            batch_number: formData.get('batchNumber'),
            remarks: formData.get('remarks'),


        };
    
        addItemIssueApi(issueData)
        .then((result) => {
            window.alert("Issue added successfully");
            props.setUpdated(true);
            setSelectedItem(null); // Clear selected item
            props.onHide(); // Close the modal
            })
            .catch((error) => {
            console.error("Failed to Add Inventory Data", error);  // Log the error to the console
            alert("Failed to Add Inventory. Check console for details.");
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
                        Item Issue Form
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
                                    <Form.Group controlId="quantityIssued">
                                        <Form.Label>Quantity Issued</Form.Label>
                                        <Form.Control type="type" name="quantityIssued" required placeholder="" className="custom-border">
                                        </Form.Control>
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <p></p>
                                <Row>
                                    <Col>
                                    <Form.Group controlId="issuedTo">
                                            <Form.Label>Issued To</Form.Label>
                                            <Form.Control type="text" name="issuedTo" required placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>  
                                    <Col>
                                    <Form.Group controlId="projectCode">
                                            <Form.Label>Project Name</Form.Label>
                                            <Select
                                                options={projectCodes}
                                                value={selectedCodes}
                                                onChange={setSelectedCodes}
                                                placeholder="Select Project Name"
                                            />
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <p></p>

                                <Row> 

                                    <Col>
                                    <Form.Group controlId="researcherName">
                                            <Form.Label>Researcher Name</Form.Label>
                                            <Select
                                                options={resNames}
                                                value={selectedNames}
                                                onChange={setSelectedNames}
                                                placeholder="Select Researcher Name"
                                            />
                                    </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group controlId="batchNumber">
                                            <Form.Label>Batch Number</Form.Label>
                                            <Form.Control type="text" name="batchNumber" required placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <p></p>

                                <Row>
                                    <Col>
                                    <Form.Group controlId="remarks">
                                            <Form.Label>Remarks</Form.Label>
                                            <Form.Control type="text" name="remarks" required placeholder="" className="custom-border" />
                                    </Form.Group>
                                    </Col>
                                    <Col></Col>
                                </Row>

                            <Form.Group>
                                <p></p>
                                <Button variant="primary" type="submit" onClick={props.onHide} style={{ width: '70px' }}>
                                    Add
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

export default AddIssueInventoryModal;