import React, { useEffect, useState, useRef } from 'react';
import {Modal, Col, Row, Form, Button} from 'react-bootstrap';
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { addItemIssueApi, getMasterApi, getProjectApi, getResEmployeeApi, addTempItemReturnApi, addTempToIssueApi } from '../../../services/AppinfoService';
import '../../inventory/formBorder.css';
import Select from 'react-select';
import TempIssueTable from './TempReturnTable';

const ReturnProduct = ({ userDetails= { name: '', lab: '', designation: '' } }) => {
    const [message, setMessage] = useState('');
    const [itemsCodes, setItemsCodes] = useState([]);
    const [itemsNames, setItemsNames] = useState([]);
    const [selectedItemCode, setSelectedItemCode] = useState(null);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [projectCodes, setProjectCodes] = useState([]);
    const [selectedCodes, setSelectedCodes] = useState(null);
    const [masterType, setMasterType] = useState('');
    const formRef = useRef(null);
    
    const [resNames, setResNames] = useState([]);
    const [selectedNames, setSelectedNames] = useState(null);

    const [errorMessages, setErrorMessages] = useState({
        bill: '',
        quantityIssued: '',
        issuedTo: '',
        batchNumber: '',
        
        returnDate:''
    });
    useEffect(() => {
        
        // Fetch project codes
        getMasterApi()
            .then(data => {
                // Filter data based on masterType
                if (masterType === 'Chemical') {
                    data = data.filter(item => item.master_type === 'Chemical');
                } else if (masterType === 'Labware') {
                    data = data.filter(item => item.master_type === 'Labware');
                }
    
                // Set items codes and names
                setItemsCodes(data.map(item => ({ value: item.c_id, label: item.item_code, itemName: item.item_name, details: { units: item.units } })));
                setItemsNames(data.map(item => ({ value: item.c_id, label: item.item_name, itemCode: item.item_code, details: { units: item.units } })));
            })
            .catch(error => console.error('Error fetching project codes:', error));
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
    
    }, [masterType]);

    const handleItemCodeChange = (selectedOption) => {
        setSelectedItemCode(selectedOption);
        const selectedItem = itemsCodes.find(item => item.value === selectedOption.value);
        setSelectedItemName({ value: selectedItem.value, label: selectedItem.itemName });
        setSelectedItemDetails(selectedItem.details);
    };
    
    const handleItemNameChange = (selectedOption) => {
        setSelectedItemName(selectedOption);
        const selectedItem = itemsNames.find(item => item.value === selectedOption.value);
        setSelectedItemCode({ value: selectedItem.value, label: selectedItem.itemCode });
        setSelectedItemDetails(selectedItem.details);
    };

    console.log("Researched Names:", resNames); // Log state to verify

    const handleAdd = () => {
        console.log(",kdjlaj");
        const formData = new FormData(formRef.current); 
        const newErrorMessages = { ...errorMessages };

        // Check if any required field is empty
        const emptyFields = ['bill', 'quantityIssued','returnDate']
            .filter(field => {
                if (!formData.get(field)) {
                    newErrorMessages[field] = `Please fill ${field}`;
                    return true;
                }
                return false;
            });
            console.log("===xvc==",emptyFields);
        if (emptyFields.length > 0) {
            console.log("=====");
            setErrorMessages(newErrorMessages);
            return; // Exit the function if any field is empty
        }
    console.log("kajdh",selectedItemCode);
        const issueData = {
            bill_no: formData.get('bill'),
            c_id: selectedItemCode.value,
            quantity_return: formData.get('quantityIssued'),
           
            receipt_date:formData.get('returnDate')


        };
    
        addTempItemReturnApi(issueData)
        .then((result) => {
            window.alert("Issue added successfully");
            setSelectedItem(null); // Clear selected item
            })
            .catch((error) => {
            console.error("Failed to Add Inventory Data", error);  // Log the error to the console
            alert("Failed to Add Inventory. Check console for details.");
            });
    };

    const handleTransferData = async () => {
        try {
          const response = await fetch('http://localhost:8000/transfer/return/', {
            method: 'POST',
          });
    
          const data = await response.json();
          setMessage(data.message);
          alert("Success")
        } catch (error) {
          console.error('Error:', error);
          setMessage('An error occurred. Please try again.');
          alert('An error occurred. Please try again.')
        }
      };


    return (
        <div>
            <div>
                <h1 style={{ textAlign: 'center' }}>
                    Add Issue  {' '} 
                    <Button variant="primary" onClick={handleAdd} style={{ width: '70px', float: 'right', marginLeft: "8px" }}>
                            Add
                    </Button>
                    <Button onClick={handleTransferData} style={{float: 'right'}}>Submit</Button>
                </h1>
            </div>
            
      <div style={{ position: "absolute", right: "1200px", top: "10px" }}>
          <p style={{ margin: 0,marginright:"100px" }}>User: {userDetails.name}</p>
          <p style={{ margin: 0,marginright:"100px" }}>Lab: {userDetails.lab}</p>
          <p style={{ margin: 0,marginright:"100px" }}>designation: {userDetails.designation}</p>
        </div>
            <p></p>
            
            <div>
                    <Row>
                        <Col sm={12}>
                        <Form onSubmit={handleAdd} ref={formRef}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="masterType">
                                        <Form.Label style={{ marginRight: '8px' }}>Master Type</Form.Label>
                                        <select
                                            value={masterType}
                                            className="form-control"
                                            style={{
                                                borderColor: 'black',
                                                display: 'inline-block', // Add this line
                                                marginRight: '30px' // Make sure marginRight is still specified
                                            }}
                                            onChange={(e) => setMasterType(e.target.value)}
                                        >
                                            <option >Select Master Type</option>
                                            <option value="Chemical">Chemical</option>
                                            <option value="Labware">Labware</option>
                                        </select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="bill">
                                        <Form.Label style={{ marginRight: '8px' }}>Bill No</Form.Label>
                                        <Form.Control type="type" name="bill" required placeholder="" className="custom-border"
                                            style={{
                                                borderColor: 'black',
                                                display: 'inline-block', // Add this line
                                                marginRight: '30px' // Make sure marginRight is still specified
                                            }}>
                                        </Form.Control>
                                    </Form.Group>
                                    <span style={{ color: 'red', float: 'center' }}>{errorMessages.bill}</span>
                                </Col>
                                <Col>
                                    <Form.Group controlId="itemCode">
                                        <Form.Label>Item Code</Form.Label>
                                        <Select
                                            options={itemsCodes.map(item => ({ value: item.value, label: item.label }))}
                                            value={selectedItemCode}
                                            onChange={handleItemCodeChange}
                                            placeholder="Select Item Code"
                                            styles={{ control: provided => ({ ...provided, borderColor: 'black' }) }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="itemName">
                                        <Form.Label>Item Name</Form.Label>
                                        <Select
                                            options={itemsNames.map(item => ({ value: item.value, label: item.label }))}
                                            value={selectedItemName}
                                            onChange={handleItemNameChange}
                                            placeholder="Select Item Name"
                                            styles={{ control: provided => ({ ...provided, borderColor: 'black' }) }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <p></p>

                            <Row>
                                <Col>
                                    <Form.Group controlId="units">
                                        <Form.Label>Units</Form.Label>
                                        <Form.Control type="text" value={selectedItemDetails ? selectedItemDetails.units : ''} readOnly
                                         style={{ borderColor: 'black' }} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="quantityIssued">
                                        <Form.Label>Quantity Return</Form.Label>
                                        <Form.Control type="type" name="quantityIssued" required placeholder="" className="custom-border">
                                        </Form.Control>
                                    </Form.Group>
                                    <span style={{ color: 'red', float: 'right' }}>{errorMessages.quantityIssued}</span>
                                </Col>
                                <Col>
    <Form.Group controlId="returnDate">
        <Form.Label>Return Date</Form.Label>
        <Form.Control 
            type="date" 
            name="returnDate" 
            required 
            placeholder="Select return date" 
            className="custom-border">
        </Form.Control>
    </Form.Group>
    <span style={{ color: 'red', float: 'right' }}>{errorMessages.returnDate}</span>
</Col>  </Row>

                                    {/* <Col>
                                    <Form.Group controlId="issuedTo">
                                            <Form.Label>Issued To</Form.Label>
                                            <Form.Control type="text" name="issuedTo" required placeholder="" className="custom-border" />
                                    </Form.Group>
                                    <span style={{ color: 'red', float: 'right' }}>{errorMessages.issuedTo}</span>
                                    </Col>   */}
                                  
                                    {/* <Form.Group controlId="projectCode">
                                            <Form.Label>Project Name</Form.Label>
                                            <Select
                                                options={projectCodes}
                                                value={selectedCodes}
                                                onChange={setSelectedCodes}
                                                placeholder="Select Project Name"
                                                styles={{ control: provided => ({ ...provided, borderColor: 'black' }) }}
                                            />
                                    </Form.Group> */}
                                    
                              
                                <p></p>

                                <Row> 

                                    {/* <Col>
                                    <Form.Group controlId="researcherName">
                                            <Form.Label>Researcher Name</Form.Label>
                                            <Select
                                                options={resNames}
                                                value={selectedNames}
                                                onChange={setSelectedNames}
                                                placeholder="Select Researcher Name"
                                                styles={{ control: provided => ({ ...provided, borderColor: 'black' }) }}
                                            />
                                    </Form.Group>
                                    </Col> */}
                                   
                                    {/* <Form.Group controlId="batchNumber">
                                            <Form.Label>Batch Number</Form.Label>
                                            <Form.Control type="text" name="batchNumber" required placeholder="" className="custom-border" />
                                    </Form.Group>
                                    <span style={{ color: 'red', float: 'right' }}>{errorMessages.batchNumber}</span>
                                    </Col>
                                    // <Col>
                                    // <Form.Group controlId="remarks">
                                    //         <Form.Label>Remarks</Form.Label>
                                    //         <Form.Control type="text" name="remarks" required placeholder="" className="custom-border" />
                                    // </Form.Group> 
                                     <span style={{ color: 'red', float: 'right' }}>{errorMessages.remarks}</span>
                                     </Col>*/}
                                </Row>
                            </Form>
                        </Col>
                    </Row>
            </div>
            <div style={{paddingTop: '10px' }}>
                <TempIssueTable />
            </div>
        </div>
    );
};

export default ReturnProduct;