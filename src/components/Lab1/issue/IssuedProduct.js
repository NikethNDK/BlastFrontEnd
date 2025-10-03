import React, { useEffect, useState, useRef } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  addItemIssueApi,
  getSuppliersApi,
  getManufacturersApi,
  getMastertyApi,
  getMasterApi,
  getTemptReceiveApi,
  getUnitsApi,
  getProjectApi,
  getResEmployeeApi,
  addTempItemIssueApi,
  addTempToIssueApi,
  getIssuesByResearcher,
} from "../../../services/AppinfoService";
import "../../inventory/formBorder.css";
import Select from "react-select";
import TempIssueTable from "./TempIssueTable";
import LabNavigation1 from "../homeLab/LabNavigation1";

const IssuedProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  console.log("🏗️ [COMPONENT] IssuedProduct component initialized with userDetails:", userDetails);
  const [masterTypes, setMasterTypes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [projectCodes, setProjectCodes] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState(null);
  const [masterType, setMasterType] = useState("");
  const [projects, setProjects] = useState([]);
  const formRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectCode, setSelectedProjectCode] = useState(null);
  const [resNames, setResNames] = useState([]);
  const [selectedNames, setSelectedNames] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedunits, setSelectedunits] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [quantityIssued, setQuantityIssued] = useState(0);
  const [selectedItem, setSelectedItem] = useState({
    code: null,
    name: null,
    details: null,
  });
  const [errorMessages, setErrorMessages] = useState({
    quantityIssued: "",
    batchNumber: "",
    manufacturer: "",
    issuedTo: "",
    supplier: "",
    expiryDate: "",
    masterType: "",
    itemCode: "",
    itemName: "",
    units: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);


  // --- Modal Handlers ---
  const handleShow = () => {
    console.log("📝 [MODAL] Opening issue form modal");
    setShowModal(true);
  };
  
  const handleClose = () => {
    console.log("📝 [MODAL] Closing issue form modal and resetting form");
    // Reset form state when closing the modal
    setSelectedItemCode(null);
    setSelectedItemName(null);
    setSelectedNames(null);
    setSelectedLocations(null);
    setSelectedCodes(null);
    setSelectedProject("");
    setMasterType("");
    setExpiryDate("");
    setQuantityIssued(0);
    setSelectedItemDetails(null);
    setErrorMessages({});
    if (formRef.current) {
      formRef.current.reset();
    }
    setShowModal(false);
  };

  useEffect(() => {
    getManufacturersApi().then((data) => {
      const formattedManufacturers = data.map((item) => ({
        value: item.id,
        label: item.manufacturer,
      }));
      setManufacturers(formattedManufacturers);
    });
    getSuppliersApi().then((data) => {
      setSuppliers(
        data.map((item) => ({ value: item.id, label: item.supplier }))
      );
    });
    getUnitsApi().then((data) => {
      setSelectedunits(
        data.map((item) => ({ value: item.id, label: item.unit_measure }))
      );
    });
  }, []);

  useEffect(() => {
    const fetchMasterTypes = async () => {
      const data = await getMastertyApi();
      setMasterTypes(data);
    };
    fetchMasterTypes();
  }, []);

  const handleProjectChange = (event) => {
    const selectedValue = event.target.value;
    console.log("🔍 [PROJECT SELECTION] Project changed to:", selectedValue);
    setSelectedProject(selectedValue);

    const selectedProj = projects.find((proj) => proj.value === selectedValue);
    if (selectedProj) {
      console.log("🔍 [PROJECT SELECTION] Found matching project:", selectedProj);
      setSelectedCodes({ value: selectedProj.code, label: selectedProj.code });
    } else {
      console.log("❌ [PROJECT SELECTION] No matching project found");
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
    if (selectedItemCode && selectedProject && expiryDate) {
      console.log("🔍 [QUANTITY FETCH] Starting quantity fetch with:", {
        selectedItemCode: selectedItemCode.label,
        selectedProject: selectedProject.value,
        expiryDate,
        userLab: userDetails.lab
      });

      getTemptReceiveApi(userDetails.lab)
        .then((data) => {
          console.log("📊 [QUANTITY FETCH] Raw API response data:", data);
          console.log("📊 [QUANTITY FETCH] Data length:", data.length);

          console.log("🔍 [QUANTITY FETCH] Looking for exact match with:", {
            targetItemCode: selectedItemCode.label,
            targetProjectCode: selectedProject.value,
            targetExpiryDate: expiryDate
          });

          const matchedItem = data.find(
            (item) => {
              const itemCodeMatch = String(item.item_code).toLowerCase() === String(selectedItemCode.label).toLowerCase();
              const projectMatch = String(item.project_code).toLowerCase() === String(selectedProject.value).toLowerCase();
              const expiryMatch = String(item.expiry_date) === String(expiryDate);
              
              console.log("🔍 [QUANTITY FETCH] Checking item:", {
                itemCode: item.item_code,
                projectCode: item.project_code,
                expiryDate: item.expiry_date,
                stock: item.stock,
                quantity_received: item.quantity_received,
                itemCodeMatch,
                projectMatch,
                expiryMatch,
                isMatch: itemCodeMatch && projectMatch && expiryMatch,
                // Show the actual comparison values
                comparison: {
                  itemCode: `${String(item.item_code).toLowerCase()} === ${String(selectedItemCode.label).toLowerCase()}`,
                  project: `${String(item.project_code).toLowerCase()} === ${String(selectedProject.value).toLowerCase()}`,
                  expiry: `${String(item.expiry_date)} === ${String(expiryDate)}`
                }
              });
              
              return itemCodeMatch && projectMatch && expiryMatch;
            }
          );

          console.log("🎯 [QUANTITY FETCH] Matched item:", matchedItem);

          if (matchedItem) {
            // Use stock field for available quantity, fallback to quantity_received
            const availableQuantity = matchedItem.stock || matchedItem.quantity_received || 0;
            console.log("✅ [QUANTITY FETCH] Setting quantity:", {
              stock: matchedItem.stock,
              quantity_received: matchedItem.quantity_received,
              availableQuantity
            });
            
            setQuantityIssued(availableQuantity);
            setSelectedItemDetails({
              quantityIssued: availableQuantity,
            });
          } else {
            console.log("❌ [QUANTITY FETCH] No exact match found, trying fallback matching...");
            
            // Fallback 1: Try matching by item code only
            const itemCodeMatch = data.find(item => 
              String(item.item_code).toLowerCase() === String(selectedItemCode.label).toLowerCase()
            );
            
            if (itemCodeMatch) {
              console.log("🔄 [QUANTITY FETCH] Found item by code only:", itemCodeMatch);
              const availableQuantity = itemCodeMatch.stock || itemCodeMatch.quantity_received || 0;
              setQuantityIssued(availableQuantity);
              setSelectedItemDetails({
                quantityIssued: availableQuantity,
              });
            } else {
              console.log("❌ [QUANTITY FETCH] No fallback match found either");
              setQuantityIssued("");
              setSelectedItemDetails(null);
            }
          }
        })
        .catch((error) => {
          console.error("💥 [QUANTITY FETCH] Error fetching quantity:", error);
        });
    } else {
      console.log("⏭️ [QUANTITY FETCH] Skipping - missing required fields:", {
        selectedItemCode: !!selectedItemCode,
        selectedProject: !!selectedProject,
        expiryDate: !!expiryDate
      });
    }
  }, [selectedItemCode, selectedProject, expiryDate, userDetails.lab]);

  useEffect(() => {
    if (!masterType) {
      console.log("⏭️ [ITEM LIST FETCH] Skipping - no master type selected");
      return;
    }

    console.log("🔍 [ITEM LIST FETCH] Starting item list fetch with:", {
      masterType,
      userLab: userDetails.lab
    });

    getTemptReceiveApi(userDetails.lab)
      .then((data) => {
        console.log("📊 [ITEM LIST FETCH] Raw API response data:", data);
        console.log("📊 [ITEM LIST FETCH] Data length:", data.length);

        if (masterType) {
          const beforeFilter = data.length;
          data = data.filter((item) => item.master_type === masterType);
          console.log("🔍 [ITEM LIST FETCH] After master type filter:", {
            beforeFilter,
            afterFilter: data.length,
            masterType
          });
        }

        const seenCodes = new Set();
        const uniqueItems = data
          .filter((item) => {
            if (!seenCodes.has(item.item_code)) {
              seenCodes.add(item.item_code);
              return true;
            }
            return false;
          })
          .map((item) => ({
            value: item.c_id,
            label: item.item_code,
            itemName: item.item_name,
            details: { units: item.units },
          }));

        console.log("📋 [ITEM LIST FETCH] Unique item codes:", uniqueItems);

        setItemsCodes(uniqueItems);

        const seenNames = new Set();
        const uniqueNames = data
          .filter((item) => {
            if (!seenNames.has(item.item_name)) {
              seenNames.add(item.item_name);
              return true;
            }
            return false;
          })
          .map((item) => ({
            value: item.c_id,
            label: item.item_name,
            itemCode: item.item_code,
            details: { units: item.units },
          }));

        console.log("📋 [ITEM LIST FETCH] Unique item names:", uniqueNames);
        setItemsNames(uniqueNames);
      })
      .catch((error) => {
        console.error("💥 [ITEM LIST FETCH] Error fetching project codes:", error);
      });

    getProjectApi()
      .then((data) => {
        const activeProjects = data.filter((item) => item.deleted === 0);
        setProjects(
          activeProjects.map((item) => ({
            value: item.project_code,
            label: item.project_name,
            code: item.project_code,
          }))
        );
      })
      .catch((error) => console.error("Error fetching projects:", error));

    getResEmployeeApi()
      .then((data) => {
        const uniqueNames = [...new Set(data)];
        setResNames(uniqueNames.map((name) => ({ value: name, label: name })));
      })
      .catch((error) =>
        console.error("Error fetching Researcher Names:", error)
      );

    if (selectedNames) {
      getIssuesByResearcher(selectedNames.value)
        .then((data) => {
          setIssues(data);
        })
        .catch((error) => {
          console.error("Error fetching issues:", error);
        });
    }
  }, [masterType, selectedNames, userDetails.lab]);

  const handleItemCodeChange = (selectedOption) => {
    console.log("🔍 [ITEM SELECTION] Item code changed to:", selectedOption);
    setSelectedItemCode(selectedOption);
    const item = itemsCodes.find((item) => item.value === selectedOption.value);
    if (item) {
      console.log("🔍 [ITEM SELECTION] Found matching item:", item);
      setSelectedItemName({ value: item.value, label: item.itemName });
    } else {
      console.log("❌ [ITEM SELECTION] No matching item found in itemsCodes");
    }
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
  };

  const handleAdd = (e) => {
    e.preventDefault();
    
    const formData = new FormData(formRef.current);
    const newErrors = {};
    let hasError = false;

    // Validate text inputs
    const requiredFields = [
      "quantityIssued",
      "project",
      "expiryDate",
      "remarks",
      "issuedTo",
    ];
    requiredFields.forEach((field) => {
      const value = formData.get(field);
      if (!value || value.trim() === "") {
        newErrors[field] = "Please fill this field";
        hasError = true;
      }
    });

    // Validate dropdown/select fields
    if (!selectedItemCode) {
      newErrors.itemCode = "Please fill this field";
      hasError = true;
    }

    if (!selectedNames) {
      newErrors.issuedTo = "Please fill this field";
      hasError = true;
    }

    if (!selectedCodes) {
      newErrors.projectCode = "Please fill this field";
      hasError = true;
    }

    if (!masterType) {
      newErrors.masterType = "Please select a master type";
      hasError = true;
    }

    if (hasError) {
      setErrorMessages(newErrors);
      return;
    }

    // Prepare data
    const issueData = {
      c_id: selectedItemCode.value,
      quantity_issued: formData.get("quantityIssued"),
      issued_to: selectedNames.value,
      project_code: selectedCodes.value,
      researcher_name: selectedNames.value,
      remarks: formData.get("remarks"),
      instruction_specification: formData.get("issuedTo"),
      master_type: masterType || "",
      item_name: selectedItemName ? selectedItemName.label : "",
      item_code: selectedItemCode ? selectedItemCode.label : "",
    };

    // Submit data
    addTempItemIssueApi(issueData)
      .then(() => {
        console.log("✅ [FORM SUBMIT] Issue added successfully, refreshing table...");
        toast.success("Issue added successfully");
        handleClose(); // Close modal and reset form
        
        // Refresh the temp issue table
        if (window.refreshTempIssueTable) {
          window.refreshTempIssueTable();
        }
      })
      .catch((error) => {
        console.error("💥 [FORM SUBMIT] Failed to Add Inventory Data", error);
        toast.error("Failed to Add Inventory. Check console for details.");
      });
  };

  const handleTransferData = async () => {
    try {
      console.log("🔄 [TRANSFER] Starting data transfer...");
      const response = await fetch("http://localhost:8000/transfer/issue/", {
        method: "POST",
      });

      const data = await response.json();
      setMessage(data.message);
      toast.success("Data transferred successfully");
      
      // Refresh the temp issue table after transfer
      if (window.refreshTempIssueTable) {
        window.refreshTempIssueTable();
      }
    } catch (error) {
      console.error("💥 [TRANSFER] Error:", error);
      setMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ marginTop: "1px", width: "100%" }}>
      <div>
        <h1 style={{
    fontSize: "var(--lab-text-3xl, 1.8rem)",
    fontWeight: 700,
    color: "var(--lab-neutral-800, #1e293b)",
    margin: 0,
    textAlign: "left",
  }}>
          ADD ISSUE
          <Button
            variant="primary"
            onClick={handleShow}
            style={{
              width: "70px",
              float: "right",
              marginLeft: "8px",
            }}
          >
            Add
          </Button>
          <Button
            onClick={handleTransferData}
            style={{ float: "right" }}
          >
            Submit
          </Button>
        </h1>
      </div>
      <p></p>

      <div style={{ paddingTop: "10px" }}>
        <TempIssueTable />
      </div>

      {/* --- Modal Component for Add Issue Form --- */}
      <Modal show={showModal} onHide={handleClose} size="xl" scrollable className="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Issue Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row style={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Col sm={12}>
              <Form ref={formRef}>
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
                          borderColor: errorMessages.masterType ? "red" : "black",
                        }}
                        onChange={(e) => {
                          setMasterType(e.target.value);
                          if (errorMessages.masterType && e.target.value) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              masterType: "",
                            }));
                          }
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
                        options={itemsCodes.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        value={selectedItemCode}
                        onChange={(selected) => {
                          handleItemCodeChange(selected);
                          if (errorMessages.itemCode && selected) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              itemCode: "",
                            }));
                          }
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
                        options={itemsNames.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        value={selectedItemName}
                        onChange={(selected) => {
                          setSelectedItemName(selected);
                          if (errorMessages.itemName && selected) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              itemName: "",
                            }));
                          }
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
                </Row>

                <p></p>

                <Row>
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
                        placeholder="Select Project Code"
                        onChange={(option) => {
                          handleProjectCodeChange(option);
                          if (errorMessages.projectCode && option) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              projectCode: "",
                            }));
                          }
                        }}
                        options={projects.map((proj) => ({
                          value: proj.code,
                          label: proj.code,
                        }))}
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

                  <Col>
                    <Form.Group controlId="researcherName">
                      <Form.Label>Issued to</Form.Label>
                      <Select
                        options={resNames}
                        value={selectedNames}
                        onChange={(selectedOption) => {
                          setSelectedNames(selectedOption);

                          if (errorMessages.researcherName && selectedOption) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              researcherName: "",
                            }));
                          }
                        }}
                        placeholder="Select Researcher Name"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.researcherName
                              ? "red"
                              : "black",
                          }),
                        }}
                      />
                      {errorMessages.researcherName && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.researcherName}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <p></p>

                <Row>
                  <Col>
                    <Form.Group controlId="expiryDate">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="expiryDate"
                        required
                        value={expiryDate}
                        className="custom-border"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setExpiryDate(e.target.value);

                          if (errorMessages.expiryDate && e.target.value) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              expiryDate: "",
                            }));
                          }
                        }}
                        style={{
                          border: `1px solid ${
                            errorMessages.expiryDate ? "red" : "black"
                          }`,
                        }}
                      />
                      {errorMessages.expiryDate && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.expiryDate}
                        </span>
                      )}
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="quantityIssued">
                      <Form.Label>Quantity Issued</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantityIssued"
                        value={quantityIssued}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          const numericValue = enteredValue === "" ? "" : parseInt(enteredValue, 10);
                          const maxQuantity = selectedItemDetails?.quantityIssued || 0;

                          console.log("🔢 [QUANTITY INPUT] Quantity field changed:", {
                            enteredValue,
                            numericValue,
                            maxQuantity,
                            selectedItemDetails
                          });

                          // Allow empty input for editing
                          if (enteredValue === "") {
                            console.log("🔢 [QUANTITY INPUT] Empty input - allowing");
                            setQuantityIssued("");
                            return;
                          }

                          // Check if it's a valid number
                          if (isNaN(numericValue)) {
                            console.log("🔢 [QUANTITY INPUT] Invalid number - ignoring");
                            return; // Don't update if not a valid number
                          }

                          // Apply constraints
                          if (numericValue > maxQuantity) {
                            console.log("🔢 [QUANTITY INPUT] Exceeds max - setting to max");
                            setQuantityIssued(maxQuantity);
                            toast.error(`Maximum available quantity is ${maxQuantity}`);
                          } else if (numericValue < 0) {
                            console.log("🔢 [QUANTITY INPUT] Negative value - setting to 0");
                            setQuantityIssued(0);
                          } else {
                            console.log("🔢 [QUANTITY INPUT] Valid value - setting to:", numericValue);
                            setQuantityIssued(numericValue);
                          }

                          // Clear error message
                          if (errorMessages.quantityIssued && enteredValue !== "") {
                            setErrorMessages((prev) => ({
                              ...prev,
                              quantityIssued: "",
                            }));
                          }
                        }}
                        min="0"
                        max={selectedItemDetails?.quantityIssued || 0}
                        className="custom-border"
                        style={{ 
                          borderColor: errorMessages.quantityIssued ? "red" : "black" 
                        }}
                        placeholder="Enter quantity"
                      />
                      {errorMessages.quantityIssued && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.quantityIssued}
                        </span>
                      )}
                      {selectedItemDetails?.quantityIssued && (
                        <small className="text-muted">
                          Available: {selectedItemDetails.quantityIssued}
                        </small>
                      )}
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="issuedTo">
                      <Form.Label>Instruction and Specification</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="issuedTo"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{
                          borderColor: errorMessages.issuedTo ? "red" : "black",
                        }}
                        onChange={() => setErrorMessages(prev => ({...prev, issuedTo: ""}))}
                      />
                      {errorMessages.issuedTo && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.issuedTo}
                        </span>
                      )}
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="remarks">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="remarks"
                        required
                        placeholder=""
                        className="custom-border"
                        style={{
                          borderColor: errorMessages.remarks ? "red" : "black",
                        }}
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

export default IssuedProduct;