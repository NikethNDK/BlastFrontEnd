import React, { useEffect, useState, useRef } from "react";
import { Form, Modal } from "react-bootstrap";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
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
import Select from "react-select";
import TempReceiveTable from "./TempReceiveTable";
import { BASE_URL } from "../../../services/AppinfoService";
import { PageLayout, PageHeader } from "../../layout/content";
import "./ReceivedProduct.css";

const getSelectStyles = (hasError) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "2.25rem",
    fontSize: "0.875rem",
    borderColor: hasError ? "#ef4444" : state.isFocused ? "#b5da21" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(197, 234, 49, 0.2)" : "none",
    "&:hover": {
      borderColor: hasError ? "#ef4444" : "#b5da21",
    },
  }),
});

const ReceivedProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // Get user from Redux store (preferred over userDetails prop)
  const reduxUser = useSelector((state) => state.user.user);
  const [tableItemCount, setTableItemCount] = useState(0);
  
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

    // Get username for filtering (from Redux or userDetails prop)
    const username = reduxUser?.user_name || userDetails.name;
    
    const fetchData = async () => {
      const masterData = await getMastertyApi();
      setMasterTypes(masterData);

      // Pass username to filter items by user's lab
      const itemData = await getMasterApi(null, username);
      setAllItems(itemData);
    };
    fetchData();
  }, [userDetails.name, reduxUser]);

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
      // Get username for notification
      const username = reduxUser?.user_name || userDetails.name;
      
      // NOTE: This uses a hardcoded URL. In a real application, this should be configurable.
      const response = await fetch(`${BASE_URL}/transfer/receive/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
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
    <PageLayout>
      <PageHeader
        title="Received product"
        actions={
          <>
            <button
              type="button"
              className="lims-header-btn"
              onClick={handleTransferData}
              disabled={tableItemCount === 0}
            >
              Submit
            </button>
            <button
              type="button"
              className="lims-header-btn"
              onClick={handleShowAdd}
            >
              <FaPlus aria-hidden />
              Add
            </button>
          </>
        }
      />

      <div className="received-product-page">
        <section className="project-panel" aria-label="Pending received items">
          <TempReceiveTable
            onEdit={openEditModal}
            onItemCountChange={setTableItemCount}
          />
        </section>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        scrollable
        centered
        backdrop="static"
        dialogClassName="project-modal project-modal--wide"
        contentClassName="project-modal-content"
        aria-labelledby="receive-item-modal-title"
      >
        <div className="project-modal-header">
          <button
            type="button"
            className="project-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <FaTimes aria-hidden />
          </button>
          <h2 id="receive-item-modal-title" className="project-modal-title">
            {modalMode === "edit" ? "Edit receive item" : "Add receive item"}
          </h2>
          <p className="project-modal-description">
            {modalMode === "edit"
              ? "Update the details for this pending receive record."
              : "Enter item and receipt details to add to the receive list."}
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          <Form
            key={formInstanceKey}
            ref={formRef}
            onSubmit={handleSubmit}
            className="project-modal-form"
          >
            <div className="received-product-form-grid">
              <Form.Group controlId="masterType" className="project-field">
                <Form.Label>Master Type</Form.Label>
                <Form.Select
                  value={masterType}
                  className={`project-field-input${
                    errorMessages.masterType ? " project-field-input--error" : ""
                  }`}
                  onChange={(e) => {
                    setMasterType(e.target.value);
                    setErrorMessages((prev) => ({ ...prev, masterType: "" }));
                  }}
                >
                  <option value="">Select Master Type</option>
                  {masterTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
                {errorMessages.masterType && (
                  <span className="project-field-error">{errorMessages.masterType}</span>
                )}
              </Form.Group>

              <Form.Group controlId="itemCode" className="project-field">
                <Form.Label>Item Code</Form.Label>
                <Select
                  classNamePrefix="rp-select"
                  options={itemsCodes}
                  value={selectedItemCode}
                  onChange={(option) => {
                    handleItemCodeChange(option);
                    setErrorMessages((prev) => ({ ...prev, itemCode: "", itemName: "" }));
                  }}
                  placeholder="Select Item Code"
                  styles={getSelectStyles(!!errorMessages.itemCode)}
                />
                {errorMessages.itemCode && (
                  <span className="project-field-error">{errorMessages.itemCode}</span>
                )}
              </Form.Group>

              <Form.Group controlId="itemName" className="project-field">
                <Form.Label>Item Name</Form.Label>
                <Select
                  classNamePrefix="rp-select"
                  options={itemsNames}
                  value={selectedItemName}
                  onChange={(option) => {
                    handleItemNameChange(option);
                    setErrorMessages((prev) => ({ ...prev, itemCode: "", itemName: "" }));
                  }}
                  placeholder="Select Item Name"
                  styles={getSelectStyles(!!errorMessages.itemName)}
                />
                {errorMessages.itemName && (
                  <span className="project-field-error">{errorMessages.itemName}</span>
                )}
              </Form.Group>

              <Form.Group controlId="units" className="project-field">
                <Form.Label>Units</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedItemDetails ? selectedItemDetails.units : ""}
                  readOnly
                  className="project-field-input project-field-input--readonly"
                />
                {errorMessages.units && (
                  <span className="project-field-error">{errorMessages.units}</span>
                )}
              </Form.Group>

              <Form.Group controlId="manufacturer" className="project-field">
                <Form.Label>Manufacturer</Form.Label>
                <Select
                  classNamePrefix="rp-select"
                  options={manufacturers}
                  value={selectedManufacturer}
                  onChange={(option) => {
                    setSelectedManufacturer(option);
                    setErrorMessages((prev) => ({ ...prev, manufacturer: "" }));
                  }}
                  placeholder="Select Manufacturer"
                  styles={getSelectStyles(!!errorMessages.manufacturer)}
                />
                {errorMessages.manufacturer && (
                  <span className="project-field-error">{errorMessages.manufacturer}</span>
                )}
              </Form.Group>

              <Form.Group controlId="supplier" className="project-field">
                <Form.Label>Supplier</Form.Label>
                <Select
                  classNamePrefix="rp-select"
                  options={suppliers}
                  value={selectedSuppliers}
                  onChange={(option) => {
                    setSelectedSuppliers(option);
                    setErrorMessages((prev) => ({ ...prev, supplier: "" }));
                  }}
                  placeholder="Select Supplier"
                  styles={getSelectStyles(!!errorMessages.supplier)}
                />
                {errorMessages.supplier && (
                  <span className="project-field-error">{errorMessages.supplier}</span>
                )}
              </Form.Group>

              <Form.Group controlId="invoiceNumber" className="project-field">
                <Form.Label>Invoice No/Date</Form.Label>
                <Form.Control
                  type="text"
                  name="invoiceNumber"
                  required
                  placeholder=""
                  className={`project-field-input${
                    errorMessages.invoiceNumber ? " project-field-input--error" : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({ ...prev, invoiceNumber: "" }))
                  }
                  defaultValue={formDefaults.invoiceNumber}
                />
                {errorMessages.invoiceNumber && (
                  <span className="project-field-error">{errorMessages.invoiceNumber}</span>
                )}
              </Form.Group>

              <Form.Group controlId="poNumber" className="project-field">
                <Form.Label>Po Number/Date</Form.Label>
                <Form.Control
                  type="text"
                  name="poNumber"
                  required
                  placeholder=""
                  className={`project-field-input${
                    errorMessages.poNumber ? " project-field-input--error" : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({ ...prev, poNumber: "" }))
                  }
                  defaultValue={formDefaults.poNumber}
                />
                {errorMessages.poNumber && (
                  <span className="project-field-error">{errorMessages.poNumber}</span>
                )}
              </Form.Group>

              <Form.Group controlId="bill" className="project-field">
                <Form.Label>Catalogue No</Form.Label>
                <Form.Control
                  type="text"
                  name="bill"
                  required
                  placeholder=""
                  className={`project-field-input${
                    errorMessages.bill ? " project-field-input--error" : ""
                  }${modalMode === "edit" ? " project-field-input--readonly" : ""}`}
                  onChange={() => setErrorMessages((prev) => ({ ...prev, bill: "" }))}
                  defaultValue={formDefaults.bill}
                  readOnly={modalMode === "edit"}
                />
                {errorMessages.bill && (
                  <span className="project-field-error">{errorMessages.bill}</span>
                )}
              </Form.Group>

              <Form.Group controlId="unitprice" className="project-field">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="unitprice"
                  required
                  placeholder=""
                  className={`project-field-input${
                    errorMessages.unitprice ? " project-field-input--error" : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({ ...prev, unitprice: "" }))
                  }
                  defaultValue={formDefaults.unitprice}
                />
                {errorMessages.unitprice && (
                  <span className="project-field-error">{errorMessages.unitprice}</span>
                )}
              </Form.Group>

              <Form.Group controlId="quantityReceived" className="project-field">
                <Form.Label>Quantity Received</Form.Label>
                <Form.Control
                  type="number"
                  name="quantityReceived"
                  required
                  placeholder=""
                  className={`project-field-input${
                    errorMessages.quantityReceived ? " project-field-input--error" : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({ ...prev, quantityReceived: "" }))
                  }
                  defaultValue={formDefaults.quantityReceived}
                />
                {errorMessages.quantityReceived && (
                  <span className="project-field-error">
                    {errorMessages.quantityReceived}
                  </span>
                )}
              </Form.Group>

              <Form.Group controlId="batchNumber" className="project-field">
                <Form.Label>Batch Number</Form.Label>
                <Form.Control
                  type="text"
                  name="batchNumber"
                  required
                  placeholder=""
                  className={`project-field-input${
                    errorMessages.batchNumber ? " project-field-input--error" : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({ ...prev, batchNumber: "" }))
                  }
                  defaultValue={formDefaults.batchNumber}
                />
                {errorMessages.batchNumber && (
                  <span className="project-field-error">{errorMessages.batchNumber}</span>
                )}
              </Form.Group>

              <Form.Group controlId="expiryDate" className="project-field">
                <Form.Label>Expiry date</Form.Label>
                <Form.Control
                  type="date"
                  name="expiryDate"
                  required
                  placeholder=""
                  className={`project-field-input${
                    errorMessages.expiryDate ? " project-field-input--error" : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({ ...prev, expiryDate: "" }))
                  }
                  defaultValue={formDefaults.expiryDate}
                />
                {errorMessages.expiryDate && (
                  <span className="project-field-error">{errorMessages.expiryDate}</span>
                )}
              </Form.Group>

              <Form.Group controlId="location" className="project-field">
                <Form.Label>Location</Form.Label>
                <Select
                  classNamePrefix="rp-select"
                  options={locations}
                  value={selectedLocations}
                  onChange={(option) => {
                    setSelectedLocations(option);
                    setErrorMessages((prev) => ({ ...prev, location: "" }));
                  }}
                  placeholder="Select Location"
                  styles={getSelectStyles(!!errorMessages.location)}
                />
                {errorMessages.location && (
                  <span className="project-field-error">{errorMessages.location}</span>
                )}
              </Form.Group>

              <Form.Group controlId="project" className="project-field">
                <Form.Label>Project Name</Form.Label>
                <Form.Select
                  name="project"
                  required
                  className="project-field-input"
                  value={selectedProject}
                  onChange={handleProjectChange}
                >
                  <option value="">Select Project</option>
                  {projects.map((proj) => (
                    <option key={proj.value} value={proj.value}>
                      {proj.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="projectCode" className="project-field">
                <Form.Label>Project Code</Form.Label>
                <Select
                  classNamePrefix="rp-select"
                  value={selectedCodes}
                  options={projects.map((proj) => ({
                    value: proj.code,
                    label: proj.code,
                  }))}
                  placeholder="Select Project Code"
                  onChange={(option) => {
                    handleProjectCodeChange(option);
                    setErrorMessages((prev) => ({ ...prev, projectCode: "" }));
                  }}
                  styles={getSelectStyles(!!errorMessages.projectCode)}
                />
                {errorMessages.projectCode && (
                  <span className="project-field-error">{errorMessages.projectCode}</span>
                )}
              </Form.Group>

              <Form.Group
                controlId="instructionSpecification"
                className="project-field project-field--span-2"
              >
                <Form.Label>Instruction and Specification</Form.Label>
                <Form.Control
                  as="textarea"
                  name="instructionSpecification"
                  required
                  placeholder=""
                  className={`project-field-input project-field-input--textarea${
                    errorMessages.instructionSpecification
                      ? " project-field-input--error"
                      : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({
                      ...prev,
                      instructionSpecification: "",
                    }))
                  }
                  defaultValue={formDefaults.instructionSpecification}
                />
                {errorMessages.instructionSpecification && (
                  <span className="project-field-error">
                    {errorMessages.instructionSpecification}
                  </span>
                )}
              </Form.Group>

              <Form.Group controlId="remarks" className="project-field project-field--span-2">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  name="remarks"
                  required
                  placeholder=""
                  className={`project-field-input project-field-input--textarea${
                    errorMessages.remarks ? " project-field-input--error" : ""
                  }`}
                  onChange={() =>
                    setErrorMessages((prev) => ({ ...prev, remarks: "" }))
                  }
                  defaultValue={formDefaults.remarks}
                />
                {errorMessages.remarks && (
                  <span className="project-field-error">{errorMessages.remarks}</span>
                )}
              </Form.Group>

              <div className="project-modal-form-actions">
                <button
                  type="button"
                  className="project-btn project-btn-outline"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button type="submit" className="project-btn project-btn-primary">
                  {modalMode === "edit" ? "Save" : "Save"}
                </button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </PageLayout>
  );
};

export default ReceivedProduct;