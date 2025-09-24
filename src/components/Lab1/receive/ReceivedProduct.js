import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Form, Button, Modal } from "react-bootstrap";
import {
  addTempToReceiveApi,
  getMasterApi,
  getManufacturersApi,
  getProjectApi,
  getMasterChemicalApi,
  getMasterLabwareApi,
  addTempItemReceiveApi,
  getUnitsApi,
  getMastertyApi,
  getSuppliersApi,
  getLocationsApi,
} from "../../../services/AppinfoService";
import "../../inventory/formBorder.css";
import Select from "react-select";
import TempReceiveTable from "./TempReceiveTable";
import axios from "axios";
import LabNavigation1 from "../homeLab/LabNavigation1";
const ReceivedProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedStockDetails, setSelectedminDetails] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [masterType, setMasterType] = useState("");
  const formRef = useRef(null); // Create a ref for the form
  const [projectNames, setProjectNames] = useState([]);
  const [projectCodes, setProjectCodes] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState(null);
  const [selectedProjectCode, setSelectedProjectCode] = useState(null);
  const [errorMessages, setErrorMessages] = useState({
    bill: "",
    quantityReceived: "",
    poNumber: "",
    batchNumber: "",
    remarks: "",
    manufacturer: "",
    supplier: "",
    unitprice: "",
    expiryDate: "",
    itemCode: "",
    itemName: "",
    instructionSpecification: "",
    location: "",
    invoiceNumber: "",
    projectName: "",
    projectCode: "",
    masterType: "",
    // requiredStock: "",
    // stock: "",
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  // const [units, setUnits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedunits, setSelectedunits] = useState(null);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const [selectedProject, setSelectedProject] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    getManufacturersApi(userDetails.name).then((data) => {
      const formattedManufacturers = data.map((item) => ({
        value: item.id,
        label: item.manufacturer,
      }));
      setManufacturers(formattedManufacturers);
    });
    getSuppliersApi(userDetails.name).then((data) => {
      setSuppliers(
        data.map((item) => ({ value: item.id, label: item.supplier }))
      );
    });

    getLocationsApi(userDetails.name).then((data) => {
      setLocations(
        data.map((item) => ({ value: item.id, label: item.location }))
      );
    });
    getProjectApi()
      .then((data) => {
        console.log("All Projects:", data); // Log full response to check structure

        const activeProjects = data.filter((item) => item.deleted === 0); // Filter only active projects

        console.log("Active Projects:", activeProjects); // Log filtered response to verify

        setProjects(
          activeProjects.map((item) => ({
            value: item.project_code,
            label: item.project_name,
            code: item.project_code,
          }))
        );
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, [userDetails.name]);

  // const handleProjectChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setSelectedProject(selectedValue);

  //   // Find selected project and update projectCode
  //   const selectedProj = projects.find((proj) => proj.value === selectedValue);
  //   if (selectedProj) {
  //     setSelectedCodes({ value: selectedProj.code, label: selectedProj.code });
  //   } else {
  //     setSelectedCodes(null);
  //   }
  // };

  // useEffect(() => {
  //   const fetchMasterTypes = async () => {
  //     const data = await getMastertyApi();
  //     setMasterTypes(data);
  //   };
  //   fetchMasterTypes();
  // }, []);

  const handleProjectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue);

    const selectedProj = projects.find((proj) => proj.value === selectedValue);
    if (selectedProj) {
      setSelectedCodes({ value: selectedProj.code, label: selectedProj.code });
    } else {
      setSelectedCodes(null);
    }
  };

  const handleProjectCodeChange = (selectedOption) => {
    setSelectedCodes(selectedOption);

    const selectedProj = projects.find(
      (proj) => proj.code === selectedOption.value
    );
    if (selectedProj) {
      setSelectedProject(selectedProj.value);
    } else {
      setSelectedProject("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const masterData = await getMastertyApi();
      setMasterTypes(masterData);

      const itemData = await getMasterApi(); // assume this fetches all items
      setAllItems(itemData);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (masterType) {
      const filteredItems = allItems.filter((item) => item.type === masterType);

      setItemsCodes(
        filteredItems.map((item) => ({
          value: item.code,
          label: item.code,
          itemName: item.name,
          details: item.details,
        }))
      );

      setItemsNames(
        filteredItems.map((item) => ({
          value: item.code,
          label: item.name,
          itemCode: item.code,
          details: item.details,
        }))
      );

      setSelectedItemCode(null); // Reset selection
      setSelectedItemName(null); // Reset selection
    } else {
      setItemsCodes([]);
      setItemsNames([]);
      setSelectedItemCode(null);
      setSelectedItemName(null);
    }
  }, [masterType]);

  useEffect(() => {
    // Fetch project codes
    getMasterApi()
      .then((data) => {
        // // Filter data based on masterType
        // if (masterType === "Chemical") {
        //   data = data.filter((item) => item.master_type === "Chemical");
        // } else if (masterType === "Labware") {
        //   data = data.filter((item) => item.master_type === "Labware");
        // } else if (masterType === "Equipment") {
        //   data = data.filter((item) => item.master_type === "Equipment");
        // }
        if (masterType) {
          data = data.filter((item) => item.master_type === masterType);
        }
        // Set items codes and names
        setItemsCodes(
          data.map((item) => ({
            value: item.c_id,
            label: item.item_code,
            itemName: item.item_name,
            details: { units: item.units, requiredStock: item.min_req_stock },
          }))
        );
        setItemsNames(
          data.map((item) => ({
            value: item.c_id,
            label: item.item_name,
            itemCode: item.item_code,
            details: { units: item.units, requiredStock: item.min_req_stock },
          }))
        );
      })
      .catch((error) => console.error("Error fetching project codes:", error));
  }, [masterType]);

  const handleItemCodeChange = (selectedOption) => {
    setSelectedItemCode(selectedOption);
    const selectedItem = itemsCodes.find(
      (item) => item.value === selectedOption.value
    );
    setSelectedItemName({
      value: selectedItem.value,
      label: selectedItem.itemName,
    });
    setSelectedItemDetails(selectedItem.details);
    setSelectedminDetails(selectedItem.details);
  };

  const handleItemNameChange = (selectedOption) => {
    setSelectedItemName(selectedOption);
    const selectedItem = itemsNames.find(
      (item) => item.value === selectedOption.value
    );
    setSelectedItemCode({
      value: selectedItem.value,
      label: selectedItem.itemCode,
    });
    setSelectedItemDetails(selectedItem.details);
    setSelectedminDetails(selectedItem.details);
  };

  // const handleAdd = () => {
  //   const formData = new FormData(formRef.current); // Access form data using ref
  //   const newErrorMessages = { ...errorMessages };

  //   // Check if any required field is empty
  //   const emptyFields = [
  //     "bill",
  //     "quantityReceived",
  //     "poNumber",
  //     "batchNumber",
  //     "remarks",
  //   ].filter((field) => {
  //     if (!formData.get(field)) {
  //       newErrorMessages[field] = `Please fill ${field}`;
  //       return true;
  //     }
  //     return false;
  //   });

  //   if (emptyFields.length > 0) {
  //     setErrorMessages(newErrorMessages);
  //     return; // Exit the function if any field is empty
  //   }

  //   const receiveData = {
  //     bill_no: formData.get("bill"),
  //     c_id: selectedItemCode ? selectedItemCode.value : null,
  //     quantity_received: formData.get("quantityReceived"),
  //     po_number: formData.get("poNumber"),
  //     batch_number: formData.get("batchNumber"),
  //     remarks: formData.get("remarks"),
  //     manufacturer: selectedManufacturer ? selectedManufacturer.label : "",
  //     supplier: selectedSuppliers ? selectedSuppliers.label : "",
  //     price_unit: formData.get("unitprice"),
  //     expiry_date: formData.get("expiryDate"),
  //     item_name: selectedItemName ? selectedItemName.label : "", // Using label for the item name
  //     item_code: selectedItemCode ? selectedItemCode.label : "",
  //     instruction_specification: formData.get("instructionSpecification"),
  //     location: selectedLocations ? selectedLocations.label : "",
  //     invoice_number: formData.get("invoiceNumber"),
  //     project_code: selectedCodes.value,
  //     project_name: selectedCodes.value,
  //     master_type: masterType ? masterType : "",
  //     unit_measure: selectedItemDetails ? selectedItemDetails.units : "", // Added Units
  //     min_req_stock: selectedStockDetails
  //       ? selectedStockDetails.requiredStock
  //       : "", // Added Minimum Required Stock
  //     // min_req_stock: formData.get("requiredStock"),
  //     // stock: formData.get("stock"),
  //   };
  //   // Validate that item code is selected
  //   if (!receiveData.c_id || !receiveData.item_name || !receiveData.item_code) {
  //     alert("Please select an item code.");
  //     return;
  //   }
  //   addTempItemReceiveApi(receiveData)
  //     .then((result) => {
  //       window.alert("Received Data added successfully");
  //       setSelectedItemCode(null);
  //       setSelectedItemName(null);
  //       setSelectedManufacturer(null);
  //       setSelectedSuppliers(null);
  //       setSelectedLocations(null);
  //       setSelectedCodes(null);
  //       setSelectedItemDetails(null);
  //       setMasterType("");
  //       setSelectedminDetails(null);
  //       setSelectedProject(null);
  //       // ✅ Reset form fields
  //       formRef.current.reset();
  //       setErrorMessages({
  //         bill: "",
  //         quantityReceived: "",
  //         poNumber: "",
  //         batchNumber: "",
  //         remarks: "",
  //         manufacturer: "",
  //         supplier: "",
  //         unitprice: "",
  //         expiryDate: "",
  //         itemCode: "",
  //         itemName: "",
  //         instructionSpecification: "",
  //         location: "",
  //         invoiceNumber: "",
  //         projectName: "",
  //         projectCode: "",
  //         masterType: "",
  //         requiredStock: "",
  //         // stock: "",
  //         // min_req_stock:"",
  //         units: "",
  //       });
  //       formRef.current.reset();
  //       handleClose();
  //     })
  //     .catch((error) => {
  //       console.error("Failed to Add Received Data", error);
  //       alert("Failed to Add Received. Check console for details.");
  //       formRef.current.reset();
  //     });
  // };

  const handleAdd = () => {
    const formData = new FormData(formRef.current);
    const newErrorMessages = {};

    // Define required fields with user-friendly labels
    const requiredFields = {
      bill: "Bill No",
      quantityReceived: "Quantity Received",
      poNumber: "PO Number",
      batchNumber: "Batch Number",
      remarks: "Remarks",
      unitprice: "Unit Price",
      expiryDate: "Expiry Date",
      instructionSpecification: "Instruction Specification",
      invoiceNumber: "Invoice Number",
    };

    // Check required text fields
    let hasError = false;
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData.get(field)) {
        newErrorMessages[field] = `Please fill this field`;
        hasError = true;
      }
    });

    // Check dropdowns/selects
    if (!selectedItemCode) {
      newErrorMessages.itemCode = "Please select an item code";
      hasError = true;
    }
    if (!selectedItemName) {
      newErrorMessages.itemName = "Please select an item name";
      hasError = true;
    }
    if (!selectedManufacturer) {
      newErrorMessages.manufacturer = "Please select a manufacturer";
      hasError = true;
    }
    if (!selectedSuppliers) {
      newErrorMessages.supplier = "Please select a supplier";
      hasError = true;
    }
    if (!selectedLocations) {
      newErrorMessages.location = "Please select a location";
      hasError = true;
    }
    if (!selectedCodes) {
      newErrorMessages.projectCode = "Please select a project code";
      hasError = true;
    }
    if (!selectedItemDetails) {
      newErrorMessages.units = "Missing unit details for item";
      hasError = true;
    }

    if (hasError) {
      setErrorMessages(newErrorMessages);
      return;
    }

    const receiveData = {
      bill_no: formData.get("bill"),
      c_id: selectedItemCode.value,
      quantity_received: formData.get("quantityReceived"),
      po_number: formData.get("poNumber"),
      batch_number: formData.get("batchNumber"),
      remarks: formData.get("remarks"),
      manufacturer: selectedManufacturer.label,
      supplier: selectedSuppliers.label,
      price_unit: formData.get("unitprice"),
      expiry_date: formData.get("expiryDate"),
      item_name: selectedItemName.label,
      item_code: selectedItemCode.label,
      instruction_specification: formData.get("instructionSpecification"),
      location: selectedLocations.label,
      invoice_number: formData.get("invoiceNumber"),
      project_code: selectedCodes.value,
      project_name: selectedCodes.value,
      master_type: masterType || "",
      unit_measure: selectedItemDetails.units,
      min_req_stock: selectedStockDetails?.requiredStock || "",
    };

    addTempItemReceiveApi(receiveData, userDetails.name)
      .then(() => {
        setErrorMessages({}); // Clear errors
        formRef.current.reset();

        setSelectedItemCode(null);
        setSelectedItemName(null);
        setSelectedManufacturer(null);
        setSelectedSuppliers(null);
        setSelectedLocations(null);
        setSelectedCodes(null);
        setSelectedItemDetails(null);
        setMasterType("");
        setSelectedminDetails(null);
        setSelectedProject(null);
        handleClose();
        alert("Received Data added successfully");
      })
      .catch((error) => {
        console.error("Add Error:", error);
        alert("Failed to add received data. Please check console.");
      });
  };

  const handleTransferData = async () => {
    try {
      const response = await fetch("http://localhost:8000/transfer/receive/", {
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
      <div style={{ marginTop: "20px", width: "100%" }}>
        <div>
          <h1 style={{ textAlign: "center", color: "black" }}>
            Add Receive
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
                        }}
                        onChange={(e) => setMasterType(e.target.value)}
                      >
                        <option value="">Select Master Type</option>
                        {masterTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </Form.Group>
                  </Col>
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
                    </Form.Group>
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
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="units">
                      <Form.Label>Units</Form.Label>
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
                </Row>
                <p></p>
                <Row>
                  <Col>
                    <Form.Group controlId="manufacturer">
                      <Form.Label>Manufacturer</Form.Label>
                      <Select
                        options={manufacturers}
                        value={selectedManufacturer}
                        onChange={setSelectedManufacturer}
                        placeholder="Select Manufacturer"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: "black",
                          }),
                        }}
                      />
                    </Form.Group>
                    <span style={{ color: "red", float: "right" }}>
                      {errorMessages.manufacturer}
                    </span>
                  </Col>
                  <Col>
                    <Form.Group controlId="supplier">
                      <Form.Label>Supplier</Form.Label>
                      <Select
                        options={suppliers}
                        value={selectedSuppliers}
                        onChange={setSelectedSuppliers}
                        placeholder="Select Supplier"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: "black",
                          }),
                        }}
                      />
                    </Form.Group>

                    <span style={{ color: "red", float: "right" }}>
                      {errorMessages.supplier}
                    </span>
                  </Col>
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
                      {errorMessages.invoiceNumber}
                    </span>
                  </Col>
                  <Col>
                    <Form.Group controlId="poNumber">
                      <Form.Label>Po Number/Date</Form.Label>
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
                </Row>
                <p></p>

                <Row>
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
                  <Col>
                    <Form.Group controlId="unitprice">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="unitprice"
                        required
                        placeholder=""
                        className="custom-border"
                      ></Form.Control>
                    </Form.Group>
                    <span style={{ color: "red", float: "right" }}>
                      {errorMessages.unitprice}
                    </span>
                  </Col>
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
                </Row>
                <p></p>
                <Row>
                  <Col>
                    <Form.Group controlId="expiryDate">
                      <Form.Label>Expiry date</Form.Label>
                      <Form.Control
                        type="date"
                        name="expiryDate"
                        required
                        placeholder=""
                        className="custom-border"
                      />
                    </Form.Group>
                    <span style={{ color: "red", float: "right" }}>
                      {errorMessages.expiryDate}
                    </span>
                  </Col>
                  <Col>
                    <Form.Group controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Select
                        options={locations}
                        value={selectedLocations}
                        onChange={setSelectedLocations}
                        placeholder="Select Location"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: "black",
                          }),
                        }}
                      />
                    </Form.Group>

                    <span style={{ color: "red", float: "right" }}>
                      {errorMessages.location}
                    </span>
                  </Col>
                  {/* <Col>
                    <Form.Group controlId="project">
                      <Form.Label>Project Name</Form.Label>
                      <Form.Control
                        as="select"
                        name="project"
                        required
                        style={{ border: "1px solid black" }}
                        value={selectedProject}
                        onChange={handleProjectChange}
                      >
                        <option value="">Select Project</option>
                        {projects.map((proj) => (
                          <option key={proj.value} value={proj.value}>
                            {proj.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="projectCode">
                      <Form.Label>Project Code</Form.Label>
                      <Select
                        value={selectedCodes}
                        placeholder="Select Project Code"
                        // isDisabled
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: "black",
                          }),
                        }}
                      />
                    </Form.Group>
                  </Col> */}
                  <Col>
                    <Form.Group controlId="project">
                      <Form.Label>Project Name</Form.Label>
                      <Form.Control
                        as="select"
                        name="project"
                        required
                        style={{ border: "1px solid black" }}
                        value={selectedProject}
                        onChange={handleProjectChange}
                      >
                        <option value="">Select Project</option>
                        {projects.map((proj) => (
                          <option key={proj.value} value={proj.value}>
                            {proj.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="projectCode">
                      <Form.Label>Project Code</Form.Label>
                      <Select
                        value={selectedCodes}
                        options={projects.map((proj) => ({
                          value: proj.code,
                          label: proj.code,
                        }))}
                        placeholder="Select Project Code"
                        onChange={handleProjectCodeChange}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: "black",
                          }),
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <p></p>
                <Row>
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
                      {errorMessages.instructionSpecification}
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
              </Form>
            </Col>
          </Row>
          <p></p>
          <TempReceiveTable />
        </div>
      </div>
    </div>
  );
};

export default ReceivedProduct;
