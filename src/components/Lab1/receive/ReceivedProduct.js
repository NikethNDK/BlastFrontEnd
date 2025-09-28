import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Form, Button, Modal } from "react-bootstrap";
import {
  // Keeping all original imports for completeness,
  // although some like getMasterChemicalApi etc. are currently unused in the component's logic
  // but were likely part of the original intent.
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
import LabNavigation1 from "../homeLab/LabNavigation1"; // This was in the original imports but isn't used in the component return

const ReceivedProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // --- State Variables ---
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false); // Controls the Add form modal visibility
  const [message, setMessage] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedStockDetails, setSelectedminDetails] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [masterType, setMasterType] = useState("");
  const formRef = useRef(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCodes, setSelectedCodes] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [errorMessages, setErrorMessages] = useState({}); // Moved here for clarity

  // --- Modal Handlers ---
  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    // Also reset form state when closing the modal, regardless of success/error
    setSelectedItemCode(null);
    setSelectedItemName(null);
    setSelectedManufacturer(null);
    setSelectedSuppliers(null);
    setSelectedLocations(null);
    setSelectedCodes(null);
    setSelectedItemDetails(null);
    setMasterType("");
    setSelectedminDetails(null);
    setSelectedProject("");
    setErrorMessages({}); // Clear validation errors
    if (formRef.current) {
        formRef.current.reset(); // Reset form fields
    }
    setShowModal(false);
  };

  // --- Data Fetching Effects (remains the same) ---
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
        const activeProjects = data.filter((item) => item.deleted === 0);
        setProjects(
          activeProjects.map((item) => ({
            value: item.project_name, // Changed to project_name for the select value
            label: item.project_name,
            code: item.project_code,
          }))
        );
      })
      .catch((error) => console.error("Error fetching projects:", error));

    const fetchData = async () => {
      const masterData = await getMastertyApi();
      setMasterTypes(masterData);

      const itemData = await getMasterApi();
      setAllItems(itemData);
    };
    fetchData();
  }, [userDetails.name]);

  // --- Project Handlers (remains the same) ---
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

  // --- Item Filtering Effect (remains the same logic, but the two useEffects are combined/cleaned) ---
  useEffect(() => {
    if (masterType) {
      // Filter items based on masterType from the combined 'allItems' state
      const filteredItems = allItems.filter((item) => item.type === masterType);

      // Map for Item Codes (Select component)
      setItemsCodes(
        filteredItems.map((item) => ({
          value: item.c_id || item.code, // Use a consistent ID/Code field
          label: item.item_code || item.code, // Use the item code as the label
          itemName: item.item_name || item.name,
          details: { units: item.units, requiredStock: item.min_req_stock },
        }))
      );

      // Map for Item Names (Select component)
      setItemsNames(
        filteredItems.map((item) => ({
          value: item.c_id || item.code, // Use a consistent ID/Code field
          label: item.item_name || item.name, // Use the item name as the label
          itemCode: item.item_code || item.code,
          details: { units: item.units, requiredStock: item.min_req_stock },
        }))
      );

      // Reset item selections when masterType changes
      setSelectedItemCode(null);
      setSelectedItemName(null);
      setSelectedItemDetails(null);
      setSelectedminDetails(null);
    } else {
      setItemsCodes([]);
      setItemsNames([]);
      setSelectedItemCode(null);
      setSelectedItemName(null);
      setSelectedItemDetails(null);
      setSelectedminDetails(null);
    }
  }, [masterType, allItems]);
  // NOTE: The original code had two similar useEffects for item data.
  // I've consolidated the logic to rely on the 'allItems' state and 'masterType' dependency,
  // which seems to align with the intent of the first item-related useEffect (lines 144-173).
  // The second one (lines 175-212) seems redundant or based on an old API structure.

  // --- Item Code/Name Handlers (remains the same) ---
  const handleItemCodeChange = (selectedOption) => {
    setSelectedItemCode(selectedOption);
    const selectedItem = itemsCodes.find(
      (item) => item.value === selectedOption.value
    );
    if (selectedItem) {
        setSelectedItemName({
            value: selectedItem.value,
            label: selectedItem.itemName,
        });
        setSelectedItemDetails(selectedItem.details);
        setSelectedminDetails(selectedItem.details);
    }
  };

  const handleItemNameChange = (selectedOption) => {
    setSelectedItemName(selectedOption);
    const selectedItem = itemsNames.find(
      (item) => item.value === selectedOption.value
    );
    if (selectedItem) {
        setSelectedItemCode({
            value: selectedItem.value,
            label: selectedItem.itemCode,
        });
        setSelectedItemDetails(selectedItem.details);
        setSelectedminDetails(selectedItem.details);
    }
  };

  // --- Add Handler (remains the same, but includes modal closure) ---
  const handleAdd = (e) => {
    e.preventDefault(); // Prevent default form submission since we are using an API call

    const formData = new FormData(formRef.current);
    const newErrorMessages = {};

    // Define required fields with user-friendly labels
    const requiredFields = {
      bill: "Catalogue No",
      quantityReceived: "Quantity Received",
      poNumber: "PO Number/Date",
      batchNumber: "Batch Number",
      remarks: "Remarks",
      unitprice: "Price",
      expiryDate: "Expiry Date",
      instructionSpecification: "Instruction and Specification",
      invoiceNumber: "Invoice No/Date",
    };

    // Check required text fields
    let hasError = false;
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData.get(field)) {
        newErrorMessages[field] = `Please fill ${label}`;
        hasError = true;
      }
    });

    // Check dropdowns/selects
    if (!masterType) {
        newErrorMessages.masterType = "Please select a master type";
        hasError = true;
    }
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

    // Prepare data for API
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
      // The original code set project_name to project_code, I'll keep that behavior.
      project_name: selectedCodes.label, // Using label (which is the code) or maybe selectedProject
      master_type: masterType || "",
      unit_measure: selectedItemDetails.units,
      min_req_stock: selectedStockDetails?.requiredStock || "",
    };

    // API call
    addTempItemReceiveApi(receiveData, userDetails.name)
      .then(() => {
        alert("Received Data added successfully");
        // Reset all state and close modal
        handleClose();
      })
      .catch((error) => {
        console.error("Add Error:", error);
        alert("Failed to add received data. Please check console.");
      });
  };

  // --- Transfer Data Handler (remains the same) ---
  const handleTransferData = async () => {
    try {
      // NOTE: This uses a hardcoded URL. In a real application, this should be configurable.
      const response = await fetch("http://localhost:8000/transfer/receive/", {
        method: "POST",
      });

      // Assuming success is based on a 200-series status code
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);
      alert("Submit Success");
    } catch (error) {
      console.error("Error during data transfer:", error);
      setMessage("An error occurred. Please try again.");
      alert("An error occurred. Please try again.");
    }
  };

  // --- Render Function ---
  return (
    <div>
      <div style={{ marginTop: "20px", width: "100%" }}>
        <div>
          <h1 style={{
    fontSize: "var(--lab-text-3xl, 1.8rem)",
    fontWeight: 700,
    color: "var(--lab-neutral-800, #1e293b)",
    margin: 0,
    textAlign: "left",
  }}>
            RECEIVED PRODUCT
            <Button
              variant="primary"
              onClick={handleShow} // Open the modal
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
          {/* The form section is now moved into the Modal component */}
          <TempReceiveTable />
        </div>
      </div>

      {/* --- Modal Component for Add Receive Form --- */}
      <Modal show={showModal} onHide={handleClose} size="xl" scrollable className="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Receive Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row style={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Col sm={12}>
              {/* NOTE: We call handleAdd on button click now, but attach ref to form */}
              <Form ref={formRef}>
                <Row>
                  <Col>
                    <Form.Group controlId="masterType">
                      <Form.Label>Master Type</Form.Label>
                      <select
                        value={masterType}
                        className="form-control"
                        style={{
                          borderColor: errorMessages.masterType ? "red" : "black",
                        }}
                        onChange={(e) => {
                            setMasterType(e.target.value);
                            setErrorMessages(prev => ({...prev, masterType: ""}));
                        }}
                      >
                        <option value="">Select Master Type</option>
                        {masterTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {errorMessages.masterType && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.masterType}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="itemCode">
                      <Form.Label>Item Code</Form.Label>
                      <Select
                        options={itemsCodes}
                        value={selectedItemCode}
                        onChange={(option) => {
                            handleItemCodeChange(option);
                            setErrorMessages(prev => ({...prev, itemCode: "", itemName: ""}));
                        }}
                        placeholder="Select Item Code"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.itemCode ? "red" : "black",
                          }),
                        }}
                      />
                      {errorMessages.itemCode && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.itemCode}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="itemName">
                      <Form.Label>Item Name</Form.Label>
                      <Select
                        options={itemsNames}
                        value={selectedItemName}
                        onChange={(option) => {
                            handleItemNameChange(option);
                            setErrorMessages(prev => ({...prev, itemCode: "", itemName: ""}));
                        }}
                        placeholder="Select Item Name"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.itemName ? "red" : "black",
                          }),
                        }}
                      />
                      {errorMessages.itemName && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.itemName}
                        </span>
                      )}
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
                      {errorMessages.units && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.units}
                        </span>
                      )}
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
                        onChange={(option) => {
                            setSelectedManufacturer(option);
                            setErrorMessages(prev => ({...prev, manufacturer: ""}));
                        }}
                        placeholder="Select Manufacturer"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.manufacturer ? "red" : "black",
                          }),
                        }}
                      />
                      {errorMessages.manufacturer && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.manufacturer}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="supplier">
                      <Form.Label>Supplier</Form.Label>
                      <Select
                        options={suppliers}
                        value={selectedSuppliers}
                        onChange={(option) => {
                            setSelectedSuppliers(option);
                            setErrorMessages(prev => ({...prev, supplier: ""}));
                        }}
                        placeholder="Select Supplier"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.supplier ? "red" : "black",
                          }),
                        }}
                      />
                      {errorMessages.supplier && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.supplier}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="invoiceNumber">
                      <Form.Label>Invoice No/Date</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoiceNumber"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{ borderColor: errorMessages.invoiceNumber ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, invoiceNumber: ""}))}
                      />
                      {errorMessages.invoiceNumber && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.invoiceNumber}
                        </span>
                      )}
                    </Form.Group>
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
                        style={{ borderColor: errorMessages.poNumber ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, poNumber: ""}))}
                      />
                      {errorMessages.poNumber && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.poNumber}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <p></p>
                <Row>
                  <Col>
                    <Form.Group controlId="bill">
                      <Form.Label>Catalogue No</Form.Label>
                      <Form.Control
                        type="text"
                        name="bill"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{ borderColor: errorMessages.bill ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, bill: ""}))}
                      />
                      {errorMessages.bill && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.bill}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="unitprice">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number" // Changed to number for price
                        name="unitprice"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{ borderColor: errorMessages.unitprice ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, unitprice: ""}))}
                      />
                      {errorMessages.unitprice && (
                        <span style={{ color: "red", float: "right" }}>
                          {errorMessages.unitprice}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="quantityReceived">
                      <Form.Label>Quantity Received</Form.Label>
                      <Form.Control
                        type="number" // Changed to number for quantity
                        name="quantityReceived"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{ borderColor: errorMessages.quantityReceived ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, quantityReceived: ""}))}
                      />
                      {errorMessages.quantityReceived && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.quantityReceived}
                        </span>
                      )}
                    </Form.Group>
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
                        style={{ borderColor: errorMessages.batchNumber ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, batchNumber: ""}))}
                      />
                      {errorMessages.batchNumber && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.batchNumber}
                        </span>
                      )}
                    </Form.Group>
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
                        style={{ borderColor: errorMessages.expiryDate ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, expiryDate: ""}))}
                      />
                      {errorMessages.expiryDate && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.expiryDate}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Select
                        options={locations}
                        value={selectedLocations}
                        onChange={(option) => {
                            setSelectedLocations(option);
                            setErrorMessages(prev => ({...prev, location: ""}));
                        }}
                        placeholder="Select Location"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.location ? "red" : "black",
                          }),
                        }}
                      />
                      {errorMessages.location && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.location}
                        </span>
                      )}
                    </Form.Group>
                  </Col>

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
                        onChange={(option) => {
                            handleProjectCodeChange(option);
                            setErrorMessages(prev => ({...prev, projectCode: ""}));
                        }}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.projectCode ? "red" : "black",
                          }),
                        }}
                      />
                      {errorMessages.projectCode && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.projectCode}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <p></p>
                <Row>
                  <Col sm={6}>
                    <Form.Group controlId="instructionSpecification">
                      <Form.Label>Instruction and Specification</Form.Label>
                      <Form.Control
                        as="textarea" // Changed to textarea for multiline input
                        name="instructionSpecification"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{ borderColor: errorMessages.instructionSpecification ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, instructionSpecification: ""}))}
                      />
                      {errorMessages.instructionSpecification && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.instructionSpecification}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="remarks">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        as="textarea" // Changed to textarea for multiline input
                        name="remarks"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{ borderColor: errorMessages.remarks ? "red" : "black" }}
                        onChange={() => setErrorMessages(prev => ({...prev, remarks: ""}))}
                      />
                      {errorMessages.remarks && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.remarks}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReceivedProduct;