import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Form, Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
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
  updateTempReceiveApi,
  getUnitsApi,
  getMastertyApi,
  getSuppliersApi,
  getLocationsApi,
  getLabsApi,
} from "../../../services/AppinfoService";
import "../../inventory/formBorder.css";
import Select from "react-select";
import TempReceiveTable from "./TempReceiveTable";
import LabNavigation1 from "../homeLab/LabNavigation1"; // This was in the original imports but isn't used in the component return
import { BASE_URL } from "../../../services/AppinfoService";

const ReceivedProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // --- State Variables ---
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false); // Controls the Add form modal visibility
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [editingItem, setEditingItem] = useState(null); // Original temp_receive row for edit
  const [pendingEditItem, setPendingEditItem] = useState(null); // Used to prefill selects after options load
  const [formDefaults, setFormDefaults] = useState({
    invoiceNumber: "",
    poNumber: "",
    bill: "",
    unitprice: "",
    quantityReceived: "",
    batchNumber: "",
    expiryDate: "",
    instructionSpecification: "",
    remarks: "",
  });
  const [formInstanceKey, setFormInstanceKey] = useState(0); // Forces <Form> remount to apply defaultValue
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
  const handleShowAdd = () => {
    setModalMode("add");
    setEditingItem(null);
    setPendingEditItem(null);
    setMasterType("");
    setSelectedItemCode(null);
    setSelectedItemName(null);
    setSelectedItemDetails(null);
    setSelectedminDetails(null);
    setSelectedManufacturer(null);
    setSelectedSuppliers(null);
    setSelectedLocations(null);
    setSelectedCodes(null);
    setSelectedProject("");
    setErrorMessages({});
    setFormDefaults({
      invoiceNumber: "",
      poNumber: "",
      bill: "",
      unitprice: "",
      quantityReceived: "",
      batchNumber: "",
      expiryDate: "",
      instructionSpecification: "",
      remarks: "",
    });
    setFormInstanceKey((k) => k + 1);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditingItem(item || null);
    setPendingEditItem(item || null);
    setErrorMessages({});

    // Prefill basic input fields via defaultValue (Form remount)
    setFormDefaults({
      invoiceNumber: item?.invoice_number || "",
      poNumber: item?.po_number || "",
      bill: item?.bill_no || "",
      unitprice: item?.price_unit || "",
      quantityReceived: item?.quantity_received || "",
      batchNumber: item?.batch_number || "",
      expiryDate: item?.expiry_date || "",
      instructionSpecification: item?.instruction_specification || "",
      remarks: item?.remarks || "",
    });
    setFormInstanceKey((k) => k + 1);

    // Try set project selections immediately (if options already loaded we'll map precisely below as well)
    setSelectedProject(item?.project_name || "");
    if (item?.project_code) {
      setSelectedCodes({ value: item.project_code, label: item.project_code });
    } else {
      setSelectedCodes(null);
    }

    // Set master type early; item code/name selects depend on this
    setMasterType(item?.master_type || "");

    // Manufacturer/supplier/location can be mapped once option arrays are ready
    setShowModal(true);
  };

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
    setModalMode("add");
    setEditingItem(null);
    setPendingEditItem(null);
    setFormDefaults({
      invoiceNumber: "",
      poNumber: "",
      bill: "",
      unitprice: "",
      quantityReceived: "",
      batchNumber: "",
      expiryDate: "",
      instructionSpecification: "",
      remarks: "",
    });
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

    getProjectApi(userDetails.name)
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

  console.log('all items',allItems)

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
      const filteredItems = allItems.filter((item) => item.master_type === masterType);

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

  // When opening edit modal, we may need to wait for dropdown options to load before mapping selections.
  useEffect(() => {
    if (!showModal || modalMode !== "edit" || !pendingEditItem) return;

    // If master_type isn't present in the temp row, infer it from the master list by item_code/name
    if (!masterType && allItems.length > 0) {
      const match = allItems.find((x) => {
        const code = x.item_code || x.code;
        const name = x.item_name || x.name;
        return (
          (pendingEditItem.item_code && code === pendingEditItem.item_code) ||
          (pendingEditItem.item_name && name === pendingEditItem.item_name)
        );
      });
      if (match?.master_type) {
        setMasterType(match.master_type);
      }
    }

    // Map manufacturer/supplier/location once options available
    if (!selectedManufacturer && pendingEditItem.manufacturer && manufacturers.length > 0) {
      const match = manufacturers.find((m) => m.label === pendingEditItem.manufacturer);
      if (match) setSelectedManufacturer(match);
    }
    if (!selectedSuppliers && pendingEditItem.supplier && suppliers.length > 0) {
      const match = suppliers.find((s) => s.label === pendingEditItem.supplier);
      if (match) setSelectedSuppliers(match);
    }
    if (!selectedLocations && pendingEditItem.location && locations.length > 0) {
      const match = locations.find((l) => l.label === pendingEditItem.location);
      if (match) setSelectedLocations(match);
    }

    // Map project name/code once projects loaded
    if (projects.length > 0) {
      if (pendingEditItem.project_name && !selectedProject) {
        setSelectedProject(pendingEditItem.project_name);
      }
      if (pendingEditItem.project_code && !selectedCodes) {
        setSelectedCodes({ value: pendingEditItem.project_code, label: pendingEditItem.project_code });
      }
    }

    // Map item selections once masterType filtering has produced options
    if (itemsCodes.length > 0 && pendingEditItem.item_code && !selectedItemCode) {
      const match = itemsCodes.find((x) => x.label === pendingEditItem.item_code);
      if (match) {
        setSelectedItemCode(match);
        setSelectedItemName({ value: match.value, label: match.itemName });
        setSelectedItemDetails(match.details);
        setSelectedminDetails(match.details);
      }
    }
    if (itemsNames.length > 0 && pendingEditItem.item_name && !selectedItemName) {
      const match = itemsNames.find((x) => x.label === pendingEditItem.item_name);
      if (match) {
        setSelectedItemName(match);
        setSelectedItemCode({ value: match.value, label: match.itemCode });
        setSelectedItemDetails(match.details);
        setSelectedminDetails(match.details);
      }
    }

    // Once critical mappings are done, clear pending to avoid repeated work
    // (keep it if we still can't map due to missing masterType/options)
    const canClear =
      (!!selectedManufacturer || !pendingEditItem.manufacturer) &&
      (!!selectedSuppliers || !pendingEditItem.supplier) &&
      (!!selectedLocations || !pendingEditItem.location) &&
      (!!selectedCodes || !pendingEditItem.project_code) &&
      (!!selectedItemCode || !pendingEditItem.item_code) &&
      (!!selectedItemName || !pendingEditItem.item_name);

    if (canClear) {
      setPendingEditItem(null);
    }
  }, [
    showModal,
    modalMode,
    pendingEditItem,
    manufacturers,
    suppliers,
    locations,
    projects,
    itemsCodes,
    itemsNames,
    selectedManufacturer,
    selectedSuppliers,
    selectedLocations,
    selectedCodes,
    selectedItemCode,
    selectedItemName,
    selectedProject,
  ]);

  // --- Add/Edit Submit Handler ---
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault(); // Prevent default form submission if called as a submit handler

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

    // Get lab ID from userDetails
    let labId = null;
    if (userDetails.lab && Array.isArray(userDetails.lab) && userDetails.lab.length > 0) {
      const labName = userDetails.lab[0];
      try {
        const labsResponse = await getLabsApi();
        const userLab = labsResponse.data.find(l => l.name === labName);
        if (userLab) {
          labId = userLab.id;
        }
      } catch (error) {
        console.error("Error fetching lab:", error);
      }
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
      project_name: selectedProject || selectedCodes.label || "",
      master_type: masterType || "",
      unit_measure: selectedItemDetails.units,
      min_req_stock: selectedStockDetails?.requiredStock || "",
      lab_id: labId, // Add lab ID for backend to assign to Master
    };

    try {
      if (modalMode === "edit" && editingItem?.bill_no) {
        // Keep unedited fields (like receipt_date/entry_no) from the original object
        const updatedPayload = {
          ...editingItem,
          ...receiveData,
          bill_no: editingItem.bill_no, // enforce stable key
        };

        await updateTempReceiveApi(editingItem.bill_no, updatedPayload);
        toast.success("Received Data updated successfully");
      } else {
        await addTempItemReceiveApi(receiveData, userDetails.name);
        toast.success("Received Data added successfully");
      }

      handleClose();

      // Refresh the temp receive table
      if (window.refreshTempReceiveTable) {
        window.refreshTempReceiveTable();
      }
    } catch (error) {
      console.error("💥 [FORM SUBMIT] Error:", error);
      toast.error(
        modalMode === "edit"
          ? "Failed to update received data. Please check console."
          : "Failed to add received data. Please check console."
      );
    }
  };

  // --- Transfer Data Handler (remains the same) ---
  const handleTransferData = async () => {
    try {
      console.log("🔄 [TRANSFER] Starting receive data transfer...");
      // NOTE: This uses a hardcoded URL. In a real application, this should be configurable.
      const response = await fetch(`${BASE_URL}/transfer/receive/`, {
        method: "POST",
      });

      // Assuming success is based on a 200-series status code
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);
      toast.success("Data transferred successfully");
      
      // Refresh the temp receive table after transfer
      if (window.refreshTempReceiveTable) {
        window.refreshTempReceiveTable();
      }
    } catch (error) {
      console.error("💥 [TRANSFER] Error during data transfer:", error);
      setMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
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
              onClick={handleShowAdd} // Open the modal (add mode)
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
          <TempReceiveTable onEdit={openEditModal} />
        </div>
      </div>

      {/* --- Modal Component for Add Receive Form --- */}
      <Modal show={showModal} onHide={handleClose} size="xl" scrollable className="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "edit" ? "Edit Receive Item" : "Add Receive Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row style={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Col sm={12}>
              {/* NOTE: We call handleAdd on button click now, but attach ref to form */}
              <Form key={formInstanceKey} ref={formRef} onSubmit={handleSubmit}>
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
                        defaultValue={formDefaults.invoiceNumber}
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
                        defaultValue={formDefaults.poNumber}
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
                        defaultValue={formDefaults.bill}
                        readOnly={modalMode === "edit"}
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
                        defaultValue={formDefaults.unitprice}
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
                        defaultValue={formDefaults.quantityReceived}
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
                        defaultValue={formDefaults.batchNumber}
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
                        defaultValue={formDefaults.expiryDate}
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
                        defaultValue={formDefaults.instructionSpecification}
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
                        defaultValue={formDefaults.remarks}
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
          <Button variant="primary" type="submit">
            {modalMode === "edit" ? "Save Changes" : "Add Item"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReceivedProduct;