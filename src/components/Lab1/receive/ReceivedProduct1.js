import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import {
  addTempToReceiveApi,
  getMasterApi,
  getMasterChemicalApi,
  getMasterLabwareApi,
  addTempItemReceiveApi,
} from "../../../services/AppinfoService";
import "../../inventory/formBorder.css";
import Select from "react-select";
import TempReceiveTable from "./TempReceiveTable";
import axios from "axios";
import { BASE_URL } from "../../../services/AppinfoService";

const ReceivedProduct = () => {
  const [message, setMessage] = useState("");
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [masterType, setMasterType] = useState("");
  const formRef = useRef(null); // Create a ref for the form
  const [errorMessages, setErrorMessages] = useState({
    bill: "",
    quantityReceived: "",
    poNumber: "",
    batchNumber: "",
    remarks: "",

    itemName: "",
    itemCode: "",
    projectName: "",
    projectCode: "",
    invoiceNumber: "",
    invoiceDate: "",
    expiryDate: "",
    batchLotNumber: "",
    manufacturer: "",
    supplier: "",
    instructionSpecification: "",
    location: "",
  });

  useEffect(() => {
    // Fetch project codes
    getMasterApi()
      .then((data) => {
        // Filter data based on masterType
        if (masterType === "Chemical") {
          data = data.filter((item) => item.master_type === "Chemical");
        } else if (masterType === "Labware") {
          data = data.filter((item) => item.master_type === "Labware");
        }

        // Set items codes and names
        setItemsCodes(
          data.map((item) => ({
            value: item.c_id,
            label: item.item_code,
            itemName: item.item_name,
            details: { units: item.units },
          }))
        );
        setItemsNames(
          data.map((item) => ({
            value: item.c_id,
            label: item.item_name,
            itemCode: item.item_code,
            details: { units: item.units },
          }))
        );
      })
      .catch((error) => console.error("Error fetching project codes:", error));
  }, [masterType]);

  const handleItemCodeChange = (selectedOption) => {
    setSelectedItemCode(selectedOption);
    // const selectedItem = itemsCodes.find(item => item.value === selectedOption.value);
    // setSelectedItemName({ value: selectedItem.value, label: selectedItem.itemName });
    // setSelectedItemDetails(selectedItem.details);
  };

  const handleItemNameChange = (selectedOption) => {
    setSelectedItemName(selectedOption);
    const selectedItem = itemsNames.find(
      (item) => item.value === selectedOption.value
    );
    // setSelectedItemCode({ value: selectedItem.value, label: selectedItem.itemCode });
    setSelectedItemDetails(selectedItem.details);
  };
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "F12" ||
      (event.ctrlKey && event.shiftKey && event.key === "I") ||
      (event.ctrlKey && event.shiftKey && event.key === "J") ||
      (event.ctrlKey && event.key === "U")
    ) {
      event.preventDefault();
    }
  });
  const handleAdd = () => {
    alert("Add button clicked!");
    const formData = new FormData(formRef.current); // Access form data using ref
    console.log("Form Data Entries:");
    const newErrorMessages = { ...errorMessages };

    // Required fields validation
    const emptyFields = [
      "bill",
      "quantityReceived",
      "poNumber",
      "batchNumber",
      "remarks",
      "itemName",
      "itemCode",
      "projectName",
      "projectCode",
      "invoiceNumber",
      "invoiceDate",
      "expiryDate",
      "batchLotNumber",
      "manufacturer",
      "supplier",
      "instructionSpecification",
      "location",
    ].filter((field) => {
      if (!formData.get(field)) {
        newErrorMessages[field] = `Please fill ${field}`;
        return true;
      }
      return false;
    });

    if (emptyFields.length > 0) {
      setErrorMessages(newErrorMessages);
      return; // Exit the function if any field is empty
    }

    // Prepare data for API call
    const receiveData = {
      bill_no: formData.get("bill"),
      c_id: selectedItemCode?.value, // Ensure selected item code is used
      item_name: formData.get("itemName"),
      item_code: formData.get("itemCode"),
      project_name: formData.get("projectName"),
      project_code: formData.get("projectCode"),
      invoice_number: formData.get("invoiceNumber"),
      invoice_date: formData.get("invoiceDate"), // Assuming it's in correct format
      expiry_date: formData.get("expiryDate"),
      batch_lot_number: formData.get("batchLotNumber"),
      manufacturer: formData.get("manufacturer"),
      supplier: formData.get("supplier"),
      instruction_specification: formData.get("instructionSpecification"),
      location: formData.get("location"),
      quantity_received: formData.get("quantityReceived"),
      po_number: formData.get("poNumber"),
      batch_number: formData.get("batchNumber"),
      remarks: formData.get("remarks"),
    };
    console.log("Sending Data to API:", receiveData);
    addTempItemReceiveApi(receiveData)
      .then((result) => {
        console.log("Form Data Entries:");
        window.alert("Received Data added successfully");
        setSelectedItemCode(null); // Clear selected item
        setErrorMessages({}); // Clear errors
        formRef.current.reset();
      })
      .catch((error) => {
        console.error("Failed to Add Received Data", error);
        alert("Failed to Add Received. Check console for details.");
        formRef.current.reset();
      });
  };
  // const handleAdd = () => {
  //     const formData = new FormData(formRef.current); // Access form data using ref
  //     const newErrorMessages = { ...errorMessages };

  //     // Check if any required field is empty
  //     const emptyFields = ['bill', 'quantityReceived', 'poNumber', 'batchNumber', 'remarks']
  //         .filter(field => {
  //             if (!formData.get(field)) {
  //                 newErrorMessages[field] = `Please fill ${field}`;
  //                 return true;
  //             }
  //             return false;
  //         });

  //     if (emptyFields.length > 0) {
  //         setErrorMessages(newErrorMessages);
  //         return; // Exit the function if any field is empty
  //     }

  //     const receiveData = {
  //         bill_no: formData.get('bill'),
  //         c_id: selectedItemCode.value,
  //         quantity_received: formData.get('quantityReceived'),
  //         po_number: formData.get('poNumber'),
  //         batch_number: formData.get('batchNumber'),
  //         remarks: formData.get('remarks'),
  //     };

  //     addTempItemReceiveApi(receiveData)
  //         .then((result) => {
  //             window.alert("Received Data added successfully");
  //             setSelectedItemCode(null); // Clear selected item
  //             setErrorMessages({
  //                 bill: '',
  //                 quantityReceived: '',
  //                 poNumber: '',
  //                 batchNumber: '',
  //                 remarks: ''
  //             });
  //             formRef.current.reset();
  //         })
  //         .catch((error) => {
  //             console.error("Failed to Add Received Data", error);
  //             alert("Failed to Add Received. Check console for details.");
  //             formRef.current.reset();
  //         });
  // };

  const handleTransferData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/transfer/receive/`, {
        method: "POST",
      });

      const data = await response.json();
      setMessage(data.message);
      alert("Success");
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <h1 style={{ textAlign: "center", color:"black" }}>
          Add Receive{" "}
          <Button
            variant="primary"
            onClick={handleAdd}
            style={{ width: "70px", float: "right", marginLeft: "8px" }}
          >
            Add
          </Button>
          <Button onClick={handleTransferData} style={{ float: "right" }}>
            Submit
          </Button>
        </h1>
      </div>
      <p></p>
      <div>
        <Row style={{ paddingLeft: "30px" }}>
          <Col sm={12}>
            <Form onSubmit={handleAdd} ref={formRef}>
              <Row>
                <Col>
                  <Form.Group controlId="masterType">
                    <Form.Label style={{ marginRight: "8px" }}>
                      Master Type
                    </Form.Label>
                    <select
                      value={masterType}
                      className="form-control"
                      style={{
                        borderColor: "black",
                        width: 200,
                        display: "inline-block", // Add this line
                        marginRight: "30px", // Make sure marginRight is still specified
                      }}
                      onChange={(e) => setMasterType(e.target.value)}
                    >
                      <option>Select Master Type</option>
                      <option value="Chemical">Chemical</option>
                      <option value="Labware">Labware</option>
                      <option value="Equipment">Equipment</option>
                    </select>
                  </Form.Group>
                </Col>
              </Row>
              <p></p>
              <Row>
                {/* <Col>
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
                                </Col> */}
                <Col>
                  <Form.Group controlId="itemCode">
                    <Form.Label>Item Code</Form.Label>
                    <Select
                      options={itemsCodes.map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                      value={selectedItemCode}
                      onChange={handleItemCodeChange}
                      placeholder="Select Item Code"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: "black",
                        }),
                      }}
                    />
                    {/* Hidden Input to Ensure Data is Submitted */}
                    <input
                      type="hidden"
                      name="itemCode"
                      value={selectedItemCode?.value || ""}
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.itemCode}
                  </span>
                </Col>

                <Col>
                  <Form.Group controlId="itemName">
                    <Form.Label>Item Name</Form.Label>
                    <Select
                      options={itemsNames.map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                      value={selectedItemName}
                      onChange={handleItemNameChange}
                      placeholder="Select Item Name"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: "black",
                        }),
                      }}
                    />
                    {/* Hidden Input to Ensure Data is Submitted */}
                    <input
                      type="hidden"
                      name="itemName"
                      value={selectedItemName?.value || ""}
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.itemName}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="units">
                    <Form.Label>Unit Measure</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        selectedItemDetails ? selectedItemDetails.units : ""
                      }
                      readOnly
                      style={{ borderColor: "black" }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="bill">
                    <Form.Label>Catalogue No</Form.Label>
                    <Form.Control
                      type="type"
                      name="bill"
                      required
                      placeholder=""
                      className="custom-border"
                    ></Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.bill}
                  </span>
                </Col>
              </Row>
              <p></p>

              <Row>
                <Col>
                  <Form.Group controlId="quantityReceived">
                    <Form.Label>Quantity Received</Form.Label>
                    <Form.Control
                      type="type"
                      name="quantityReceived"
                      required
                      placeholder=""
                      className="custom-border"
                    ></Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.quantityReceived}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="poNumber">
                    <Form.Label>PO Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="poNumber"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.poNumber}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="batchNumber">
                    <Form.Label>Batch Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="batchNumber"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>

                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.batchNumber}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="remarks">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      name="remarks"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.remarks}
                  </span>
                </Col>
              </Row>
              <p></p>
              <Row>
                <Col>
                  <Form.Group controlId="invoiceDate">
                    <Form.Label>Received date</Form.Label>
                    <Form.Control
                      type="type"
                      name="invoiceDate"
                      required
                      placeholder=""
                      className="custom-border"
                    ></Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.quantityReceived}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="manufacturer">
                    <Form.Label>Manufacturer</Form.Label>
                    <Form.Control
                      type="type"
                      name="manufacturer"
                      required
                      placeholder=""
                      className="custom-border"
                    ></Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.quantityReceived}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="supplier">
                    <Form.Label>Supplier</Form.Label>
                    <Form.Control
                      type="text"
                      name="supplier"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>

                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.batchNumber}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="instructionSpecification">
                    <Form.Label>Instruction and Specification</Form.Label>
                    <Form.Control
                      type="text"
                      name="instructionSpecification"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.remarks}
                  </span>
                </Col>
              </Row>
              <p></p>
              <Row>
                <Col>
                  <Form.Group controlId="projectCode">
                    <Form.Label>Project code</Form.Label>
                    <Form.Control
                      type="type"
                      name="projectCode"
                      required
                      placeholder=""
                      className="custom-border"
                    ></Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.quantityReceived}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="projectName">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      type="type"
                      name="projectName"
                      required
                      placeholder=""
                      className="custom-border"
                    ></Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.quantityReceived}
                  </span>
                </Col>
                {/* <Col>
                                    <Form.Group controlId="batchNumber">
                                        <Form.Label>Catalogue NO</Form.Label>
                                        <Form.Control type="text" name="batchNumber" required placeholder="" className="custom-border" />
                                    </Form.Group>

                                    <span style={{ color: 'red', float: 'right' }}>{errorMessages.batchNumber}</span>
                                </Col> */}
                <Col>
                  <Form.Group controlId="expiryDate">
                    <Form.Label>Expiry date</Form.Label>
                    <Form.Control
                      type="text"
                      name="expiryDate"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.remarks}
                  </span>
                </Col>
              </Row>
              <p></p>
              <Row>
                {/* <Col>
                                    <Form.Group controlId="units">
                                        <Form.Label>Unit Price</Form.Label>
                                        <Form.Control type="text" value={selectedItemDetails ? selectedItemDetails.units : ''} readOnly
                                         style={{ borderColor: 'black' }} />
                                    </Form.Group>
                                </Col> */}
                <Col>
                  <Form.Group controlId="invoiceNumber">
                    <Form.Label>Invoice No/Date</Form.Label>
                    <Form.Control
                      type="type"
                      name="invoiceNumber"
                      required
                      placeholder=""
                      className="custom-border"
                    ></Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.quantityReceived}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>

                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.batchNumber}
                  </span>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
      <TempReceiveTable />
    </div>
  );
};

export default ReceivedProduct;
