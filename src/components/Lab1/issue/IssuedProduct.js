import React, { useEffect, useState, useRef } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
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
  fetchItemExpiryDates,
  fetchItemLocations,
  updateTempIssueApi,
  acceptTempIssueApi,
  getTempIssueApi,
} from "../../../services/AppinfoService";
import "../../inventory/formBorder.css";
import Select from "react-select";
import TempIssueTable from "./TempIssueTable";
import LabNavigation1 from "../homeLab/LabNavigation1";
import { BASE_URL } from "../../../services/AppinfoService";

const IssuedProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // Get user from Redux as fallback/primary source
  const reduxUser = useSelector((state) => state.user.user);
  
  // Merge userDetails prop with Redux user data (Redux takes priority)
  const effectiveUserDetails = reduxUser ? {
    name: reduxUser.user_name || userDetails.name || "",
    user_name: reduxUser.user_name || userDetails.user_name || userDetails.name || "",
    lab: reduxUser.lab || userDetails.lab || "N/A",
    designation: reduxUser.designation || userDetails.designation || "Not Assigned",
    role: reduxUser.role || userDetails.role || ""
  } : userDetails;
  
  const [masterTypes, setMasterTypes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");
  const [tableItemCount, setTableItemCount] = useState(0);
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
  const populateFormRef = useRef(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectCode, setSelectedProjectCode] = useState(null);
  const [resNames, setResNames] = useState([]);
  const [selectedNames, setSelectedNames] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [expiryDates, setExpiryDates] = useState([]);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedunits, setSelectedunits] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [quantityIssued, setQuantityIssued] = useState(0);
  const [instructionSpecification, setInstructionSpecification] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedItem, setSelectedItem] = useState({
    code: null,
    name: null,
    details: null,
  });
  const [errorMessages, setErrorMessages] = useState({
    quantityIssued: "",
    batchNumber: "",
    manufacturer: "",
    instruction_specification: "",
    supplier: "",
    expiryDate: "",
    location: "",
    masterType: "",
    itemCode: "",
    itemName: "",
    units: "",
  });

  // Modal state - single source of truth
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);


  // --- Modal Handlers ---
  const handleShow = () => {
    console.log("📝 [MODAL] Opening issue form modal (Add mode)");
    setIsEditMode(false);
    setEditingIssue(null);
    setShowModal(true);
  };

  // Function to open modal in Edit mode - exposed to child components
  const openIssueEditor = (issue) => {
    console.log("📝 [MODAL] Opening issue form modal (Edit mode)", issue);
    setIsEditMode(true);
    setEditingIssue(issue);
    populateFormFromIssue(issue);
    setShowModal(true);
  };
  
  const handleClose = () => {
    console.log("📝 [MODAL] Closing issue form modal and resetting form");
    // Reset form state when closing the modal
    setSelectedItemCode(null);
    setSelectedItemName(null);
    setSelectedNames(null);
    setSelectedLocation(null);
    setSelectedCodes(null);
    setSelectedProject("");
    setMasterType("");
    setExpiryDate("");
    setQuantityIssued(0);
    setSelectedItemDetails(null);
    setExpiryDates([]);
    setLocations([]);
    setSelectedExpiryDate(null);
    setSelectedLocation(null);
    setInstructionSpecification("");
    setRemarks("");
    setErrorMessages({});
    setIsEditMode(false);
    setEditingIssue(null);
    populateFormRef.current = false; // Reset populate flag
    if (formRef.current) {
      formRef.current.reset();
    }
    setShowModal(false);
  };

  // Populate form fields from issue data for Edit mode
  const populateFormFromIssue = (issue) => {
    console.log("📝 [POPULATE] Populating form from issue:", issue);
    
    // Reset form first
    if (formRef.current) {
      formRef.current.reset();
    }

    // Set master type first (this triggers item list fetch via useEffect)
    if (issue.master_type) {
      setMasterType(issue.master_type);
    }

    // Set quantity issued (doesn't depend on dropdowns)
    if (issue.quantity_issued) {
      setQuantityIssued(issue.quantity_issued);
    }

    // Set instruction_specification in state
    if (issue.instruction_specification) {
      setInstructionSpecification(issue.instruction_specification);
    } else {
      setInstructionSpecification("");
    }

    // Set remarks in state
    if (issue.remarks) {
      setRemarks(issue.remarks);
    } else {
      setRemarks("");
    }

    // Store issue data for useEffect to complete population
    // The useEffect below will handle dropdown-dependent fields
  };

  // useEffect to complete form population when dropdowns are ready
  useEffect(() => {
    if (!isEditMode || !editingIssue) {
      populateFormRef.current = false;
      return;
    }

    // Wait for itemsCodes to be populated (triggered by masterType change)
    if (itemsCodes.length === 0 || itemsNames.length === 0) {
      return; // Not ready yet
    }

    // Prevent multiple population attempts
    if (populateFormRef.current) {
      return;
    }

    console.log("📝 [POPULATE-EFFECT] Completing form population");
    populateFormRef.current = true;

    // Set item code and name
    if (editingIssue.item_code && editingIssue.c_id) {
      const matchingItemCode = itemsCodes.find(
        (item) => item.label === editingIssue.item_code || item.value === editingIssue.c_id
      );
      if (matchingItemCode && !selectedItemCode) {
        setSelectedItemCode(matchingItemCode);
        // Trigger item code change to fetch expiry dates and locations
        handleItemCodeChange(matchingItemCode).then(() => {
          // After expiry dates and locations are loaded, set them
          setTimeout(() => {
            // Set expiry date
            if (editingIssue.expiry_date) {
              const matchingExpiry = expiryDates.find(
                (exp) => exp.value === editingIssue.expiry_date || 
                         exp.raw_date === editingIssue.expiry_date ||
                         exp.label === editingIssue.expiry_date
              );
              if (matchingExpiry) {
                setSelectedExpiryDate(matchingExpiry);
              }
            }

            // Set location
            if (editingIssue.location) {
              const matchingLocation = locations.find(
                (loc) => loc.value === editingIssue.location || loc.label === editingIssue.location
              );
              if (matchingLocation) {
                setSelectedLocation(matchingLocation);
              }
            }
          }, 500);
        });
      }

      const matchingItemName = itemsNames.find(
        (item) => item.label === editingIssue.item_name || item.value === editingIssue.c_id
      );
      if (matchingItemName && !selectedItemName) {
        setSelectedItemName(matchingItemName);
      }
    }

    // Set project
    if (editingIssue.project_code && projects.length > 0 && !selectedCodes) {
      const matchingProject = projects.find(
        (proj) => proj.code === editingIssue.project_code
      );
      if (matchingProject) {
        setSelectedProject(matchingProject.value);
        setSelectedCodes({ value: matchingProject.code, label: matchingProject.code });
      }
    }

    // Set researcher/issued to
    if ((editingIssue.issued_to || editingIssue.researcher_name) && resNames.length > 0 && !selectedNames) {
      const researcherName = editingIssue.issued_to || editingIssue.researcher_name;
      const matchingResearcher = resNames.find(
        (res) => res.value === researcherName || res.label === researcherName
      );
      if (matchingResearcher) {
        setSelectedNames(matchingResearcher);
      }
    }
  }, [isEditMode, editingIssue, itemsCodes, itemsNames, projects, resNames, expiryDates, locations, selectedItemCode, selectedItemName, selectedCodes, selectedNames]);

  // Set default project when modal opens in Add mode and only one project is available
  useEffect(() => {
    if (showModal && !isEditMode && projects.length === 1 && !selectedProject && !editingIssue) {
      console.log("🔍 [PROJECT] Modal opened in Add mode with single project, setting default:", projects[0]);
      setSelectedProject(projects[0].value);
      setSelectedCodes({ value: projects[0].code, label: projects[0].code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, isEditMode, projects.length, selectedProject, editingIssue]);

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
    if (selectedItemCode && selectedProject && selectedExpiryDate && selectedLocation) {
      console.log("🔍 [QUANTITY FETCH] Starting quantity fetch with:", {
        selectedItemCode: selectedItemCode.label,
        selectedProject: selectedProject.value,
        selectedExpiryDate: selectedExpiryDate.value,
        selectedLocation: selectedLocation.value,
        userLab: effectiveUserDetails.lab,
        isEditMode: isEditMode
      });

      const username = effectiveUserDetails.user_name || effectiveUserDetails.name || null;
      const labName = Array.isArray(effectiveUserDetails.lab) 
        ? effectiveUserDetails.lab[0] 
        : (effectiveUserDetails.lab !== 'N/A' ? effectiveUserDetails.lab : null);
      getTemptReceiveApi(labName, username)
        .then((data) => {
          console.log("📊 [QUANTITY FETCH] Raw API response data:", data);
          console.log("📊 [QUANTITY FETCH] Data length:", data.length);

          console.log("🔍 [QUANTITY FETCH] Looking for exact match with:", {
            targetItemCode: selectedItemCode.label,
            targetProjectCode: selectedProject.value,
            targetExpiryDate: selectedExpiryDate.value,
            targetLocation: selectedLocation.value
          });

          const matchedItem = data.find(
            (item) => {
              const itemCodeMatch = String(item.item_code).toLowerCase() === String(selectedItemCode.label).toLowerCase();
              const projectMatch = String(item.project_code).toLowerCase() === String(selectedProject.value).toLowerCase();
              const expiryMatch = String(item.expiry_date) === String(selectedExpiryDate.value);
              const locationMatch = String(item.location).toLowerCase() === String(selectedLocation.value).toLowerCase();
              
              console.log("🔍 [QUANTITY FETCH] Checking item:", {
                itemCode: item.item_code,
                projectCode: item.project_code,
                expiryDate: item.expiry_date,
                location: item.location,
                stock: item.stock,
                quantity_received: item.quantity_received,
                itemCodeMatch,
                projectMatch,
                expiryMatch,
                locationMatch,
                isMatch: itemCodeMatch && projectMatch && expiryMatch && locationMatch,
                // Show the actual comparison values
                comparison: {
                  itemCode: `${String(item.item_code).toLowerCase()} === ${String(selectedItemCode.label).toLowerCase()}`,
                  project: `${String(item.project_code).toLowerCase()} === ${String(selectedProject.value).toLowerCase()}`,
                  expiry: `${String(item.expiry_date)} === ${String(selectedExpiryDate.value)}`,
                  location: `${String(item.location).toLowerCase()} === ${String(selectedLocation.value).toLowerCase()}`
                }
              });
              
              return itemCodeMatch && projectMatch && expiryMatch && locationMatch;
            }
          );

          console.log("🎯 [QUANTITY FETCH] Matched item:", matchedItem);

          if (matchedItem) {
            // Use stock field for available quantity, fallback to quantity_received
            const availableQuantity = matchedItem.stock || matchedItem.quantity_received || 0;
            console.log("✅ [QUANTITY FETCH] Available quantity:", {
              stock: matchedItem.stock,
              quantity_received: matchedItem.quantity_received,
              availableQuantity,
              isEditMode: isEditMode
            });
            
            // Update selectedItemDetails to show available stock as hint
            setSelectedItemDetails({
              quantityIssued: availableQuantity,
            });
            
            // Only set quantity if NOT in edit mode (preserve existing quantity in edit mode)
            if (!isEditMode) {
              setQuantityIssued(availableQuantity);
            } else {
              console.log("📝 [QUANTITY FETCH] Edit mode: preserving existing quantity:", quantityIssued);
            }
          } else {
            console.log("❌ [QUANTITY FETCH] No exact match found, trying fallback matching...");
            
            // Fallback 1: Try matching by item code and location
            const itemCodeMatch = data.find(item => 
              String(item.item_code).toLowerCase() === String(selectedItemCode.label).toLowerCase() &&
              String(item.location).toLowerCase() === String(selectedLocation.value).toLowerCase()
            );
            
            if (itemCodeMatch) {
              console.log("🔄 [QUANTITY FETCH] Found item by code only:", itemCodeMatch);
              const availableQuantity = itemCodeMatch.stock || itemCodeMatch.quantity_received || 0;
              
              // Update selectedItemDetails to show available stock as hint
              setSelectedItemDetails({
                quantityIssued: availableQuantity,
              });
              
              // Only set quantity if NOT in edit mode
              if (!isEditMode) {
                setQuantityIssued(availableQuantity);
              }
            } else {
              console.log("❌ [QUANTITY FETCH] No fallback match found either");
              
              // Only clear quantity if NOT in edit mode
              if (!isEditMode) {
                setQuantityIssued("");
                setSelectedItemDetails(null);
              } else {
                // In edit mode, just clear the hint but preserve quantity
                setSelectedItemDetails(null);
              }
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
        selectedExpiryDate: !!selectedExpiryDate,
        selectedLocation: !!selectedLocation
      });
    }
  }, [selectedItemCode, selectedProject, selectedExpiryDate, selectedLocation, effectiveUserDetails.lab, isEditMode]);

  useEffect(() => {
    if (!masterType) {
      console.log("⏭️ [ITEM LIST FETCH] Skipping - no master type selected");
      return;
    }

    console.log("🔍 [ITEM LIST FETCH] Starting item list fetch with:", {
      masterType,
      userLab: effectiveUserDetails.lab,
      userDetails: effectiveUserDetails
    });

    const username = effectiveUserDetails.user_name || effectiveUserDetails.name || null;
    const labName = Array.isArray(effectiveUserDetails.lab) 
      ? effectiveUserDetails.lab[0] 
      : (effectiveUserDetails.lab !== 'N/A' ? effectiveUserDetails.lab : null);
    getTemptReceiveApi(labName, username)
      .then((data) => {
        console.log("📊 [ITEM LIST FETCH] Raw API response data:", data);
        console.log("📊 [ITEM LIST FETCH] Data length:", data.length);

        // Log all unique master_types in the data
        const uniqueMasterTypes = [...new Set(data.map(item => item.master_type))];
        console.log("🔍 [ITEM LIST FETCH] Unique master_types in data:", uniqueMasterTypes);

        if (masterType) {
          const beforeFilter = data.length;
          data = data.filter((item) => item.master_type && item.master_type.toLowerCase() === masterType.toLowerCase());
          console.log("🔍 [ITEM LIST FETCH] After master type filter:", {
            beforeFilter,
            afterFilter: data.length,
            masterType,
            filteredItems: data.map(item => ({ item_code: item.item_code, master_type: item.master_type, location: item.location }))
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

    // Use the same username and labName already declared above for project filtering
    getProjectApi(username, labName)
      .then((data) => {
        const activeProjects = data.filter((item) => item.deleted === 0);
        const formattedProjects = activeProjects.map((item) => ({
          value: item.project_code,
          label: item.project_name,
          code: item.project_code,
        }));
        
        setProjects(formattedProjects);
        
        // If only one project is available and not in edit mode, set it as default
        if (formattedProjects.length === 1 && !isEditMode && !selectedProject) {
          console.log("🔍 [PROJECT] Auto-selecting single available project:", formattedProjects[0]);
          setSelectedProject(formattedProjects[0].value);
          setSelectedCodes({ value: formattedProjects[0].code, label: formattedProjects[0].code });
        }
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
  }, [masterType, selectedNames, effectiveUserDetails.lab]);

  const handleItemCodeChange = async (selectedOption) => {
    console.log("🔍 [ITEM SELECTION] Item code changed to:", selectedOption);
    setSelectedItemCode(selectedOption);
    const item = itemsCodes.find((item) => item.value === selectedOption.value);
    if (item) {
      console.log("🔍 [ITEM SELECTION] Found matching item:", item);
      setSelectedItemName({ value: item.value, label: item.itemName });
      
      // Fetch expiry dates for the selected item
      try {
        console.log("🔍 [EXPIRY] Fetching expiry dates for item:", item.label);
        const response = await fetchItemExpiryDates(item.label);
        console.log("🔍 [EXPIRY] Received expiry dates:", response.expiry_dates);
        
        // Convert to react-select format
        const expiryOptions = response.expiry_dates.map(date => ({
          value: date.value,
          label: date.label,
          raw_date: date.raw_date
        }));
        
        setExpiryDates(expiryOptions);
        setSelectedExpiryDate(null); // Reset selection
      } catch (error) {
        console.error("💥 [EXPIRY] Error fetching expiry dates:", error);
        setExpiryDates([]);
        setSelectedExpiryDate(null);
        toast.error("Failed to fetch expiry dates for this item");
      }

      // Fetch locations for the selected item
      try {
        console.log("🔍 [LOCATION] Fetching locations for item:", item.label);
        const response = await fetchItemLocations(item.label);
        console.log("🔍 [LOCATION] Received locations:", response.locations);
        
        // Convert to react-select format
        const locationOptions = response.locations.map(location => ({
          value: location.value,
          label: location.label
        }));
        
        setLocations(locationOptions);
        setSelectedLocation(null); // Reset selection
      } catch (error) {
        console.error("💥 [LOCATION] Error fetching locations:", error);
        setLocations([]);
        setSelectedLocation(null);
        toast.error("Failed to fetch locations for this item");
      }
    } else {
      console.log("❌ [ITEM SELECTION] No matching item found in itemsCodes");
      setExpiryDates([]);
      setSelectedExpiryDate(null);
      setLocations([]);
      setSelectedLocation(null);
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

    // Validate text inputs - use state values for controlled fields
    // Quantity must be a positive number (greater than 0)
    if (!quantityIssued || quantityIssued === 0 || quantityIssued === "" || quantityIssued < 1) {
      newErrors.quantityIssued = "Please enter a positive quantity (greater than 0)";
      hasError = true;
    }
    
    // Validate quantity against available quantity (only if quantity is provided and available quantity is known)
    const availableQuantity = selectedItemDetails?.quantityIssued;
    if (quantityIssued && quantityIssued !== "" && quantityIssued !== 0 && 
        availableQuantity !== null && availableQuantity !== undefined) {
      const enteredQuantity = parseInt(quantityIssued, 10);
      if (!isNaN(enteredQuantity) && enteredQuantity > availableQuantity) {
        newErrors.quantityIssued = `Quantity cannot exceed available quantity (${availableQuantity})`;
        hasError = true;
        // Show toast error message
        toast.error(`Quantity entered (${enteredQuantity}) exceeds available quantity (${availableQuantity}). Please enter a quantity less than or equal to ${availableQuantity}.`);
      }
    }
    
    if (!instructionSpecification || instructionSpecification.trim() === "") {
      newErrors.instruction_specification = "Please fill this field";
      hasError = true;
    }
    
    if (!remarks || remarks.trim() === "") {
      newErrors.remarks = "Please fill this field";
      hasError = true;
    }
    
    const projectValue = formData.get("project");
    if (!projectValue || projectValue.trim() === "") {
      newErrors.project = "Please fill this field";
      hasError = true;
    }

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

    if (!selectedExpiryDate) {
      newErrors.expiryDate = "Please select an expiry date";
      hasError = true;
    }

    if (!selectedLocation) {
      newErrors.location = "Please select a location";
      hasError = true;
    }

    if (hasError) {
      setErrorMessages(newErrors);
      return; // Prevent form submission and modal closing
    }

    // Prepare data - use state values for controlled fields
    const issueData = {
      c_id: selectedItemCode.value,
      quantity_issued: quantityIssued,
      issued_to: selectedNames.value,
      project_code: selectedCodes.value,
      researcher_name: selectedNames.value,
      remarks: remarks,
      instruction_specification: instructionSpecification,
      master_type: masterType || "",
      item_name: selectedItemName ? selectedItemName.label : "",
      item_code: selectedItemCode ? selectedItemCode.label : "",
      expiry_date: selectedExpiryDate ? selectedExpiryDate.value : "",
      location: selectedLocation ? selectedLocation.value : "",
      lab_assistant_name: effectiveUserDetails.user_name || null,
    };

    // Submit data - unified handler for both Add and Edit
    if (isEditMode && editingIssue) {
      // Edit mode: Update existing issue
      updateTempIssueApi(editingIssue.entry_no, issueData)
        .then(() => {
          console.log("✅ [FORM SUBMIT] Issue updated successfully, refreshing table...");
          toast.success("Issue updated successfully");
          handleClose(); // Close modal and reset form
          
          // Refresh the temp issue table
          if (window.refreshTempIssueTable) {
            window.refreshTempIssueTable();
          }
        })
        .catch((error) => {
          console.error("💥 [FORM SUBMIT] Failed to Update Issue", error);
          toast.error("Failed to Update Issue. Check console for details.");
        });
    } else {
      // Add mode: Create new issue
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
    }
  };

  // Helper function to validate manufacturer and expiry date for items
  const validateItemsForSubmission = (items, itemType) => {
    const invalidItems = items.filter(item => {
      const missingManufacturer = !item.manufacturer || 
                                  (typeof item.manufacturer === 'string' && item.manufacturer.trim() === "");
      const missingExpiryDate = !item.expiry_date || 
                                item.expiry_date === null || 
                                item.expiry_date === undefined ||
                                (typeof item.expiry_date === 'string' && item.expiry_date.trim() === "");
      return missingManufacturer || missingExpiryDate;
    });

    if (invalidItems.length > 0) {
      const itemCodes = invalidItems.map(item => item.item_code || `Entry #${item.entry_no}`).join(", ");
      toast.error(
        `Cannot submit: ${invalidItems.length} item(s) are missing manufacturer or expiry date. ` +
        `Please edit all items to add manufacturer and expiry date before submitting. ` +
        `Items: ${itemCodes}`
      );
      return false;
    }
    return true;
  };

  const handleTransferData = async () => {
    try {
      console.log("🔄 [SUBMIT] Starting submit process...");
      
      // Get username from Redux or userDetails for filtering
      const username = reduxUser?.user_name || effectiveUserDetails.user_name || null;
      const allTempItems = await getTempIssueApi(username);
      
      // Step 1: Validate and Accept all LAB-OPEN items (prepare for researcher confirmation)
      try {
        const itemsToAccept = allTempItems.filter(item => item.status === "LAB-OPEN");
        
        if (itemsToAccept.length > 0) {
          console.log(`📝 [ACCEPT] Found ${itemsToAccept.length} LAB-OPEN items to accept`);
          
          // Validate all LAB-OPEN items have manufacturer and expiry date
          if (!validateItemsForSubmission(itemsToAccept, "LAB-OPEN")) {
            console.log("❌ [ACCEPT] Validation failed - missing manufacturer or expiry date");
            return; // Stop here - atomic operation (all or none)
          }
          
          // Accept all LAB-OPEN items
          const acceptPromises = itemsToAccept.map(item => 
            acceptTempIssueApi(item.entry_no).catch(err => {
              console.error(`💥 [ACCEPT] Failed to accept item ${item.entry_no}:`, err);
              return { error: true, entry_no: item.entry_no };
            })
          );
          
          const acceptResults = await Promise.all(acceptPromises);
          const failed = acceptResults.filter(r => r && r.error);
          const succeeded = acceptResults.filter(r => !r || !r.error);
          
          if (succeeded.length > 0) {
            console.log(`✅ [ACCEPT] Successfully accepted ${succeeded.length} items`);
            toast.success(`${succeeded.length} item(s) prepared and sent to researcher for confirmation`);
          }
          
          if (failed.length > 0) {
            console.warn(`⚠️ [ACCEPT] Failed to accept ${failed.length} items`);
            toast.warning(`Some items could not be accepted. Please try again.`);
          }
        } else {
          console.log("📝 [ACCEPT] No LAB-OPEN items to accept");
        }
      } catch (error) {
        console.error("💥 [ACCEPT] Error accepting items:", error);
        toast.error("Error accepting items. Please try again.");
        return; // Stop here if accept fails
      }
      
      // Step 2: Validate and Transfer LAB-ACT items (researcher confirmed items)
      console.log("🔄 [TRANSFER] Transferring confirmed items to inventory...");
      
      // Re-fetch items to get updated status after acceptance
      const updatedTempItems = await getTempIssueApi(username);
      const itemsToTransfer = updatedTempItems.filter(item => item.status === "LAB-ACT");
      
      if (itemsToTransfer.length > 0) {
        console.log(`📝 [TRANSFER] Found ${itemsToTransfer.length} LAB-ACT items to transfer`);
        
        // Validate all LAB-ACT items have manufacturer and expiry date
        if (!validateItemsForSubmission(itemsToTransfer, "LAB-ACT")) {
          console.log("❌ [TRANSFER] Validation failed - missing manufacturer or expiry date");
          return; // Stop here - atomic operation (all or none)
        }
      }
      
      const response = await fetch(`${BASE_URL}/transfer/issue/`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Transfer failed");
      }

      const data = await response.json();
      setMessage(data.message);
      
      // Check if backend actually processed items
      // If processed_count is provided, use it; otherwise assume success
      if (data.processed_count !== undefined && data.processed_count === 0) {
        toast.info("No confirmed items ready for transfer. Waiting for researcher confirmation.");
      } else {
        toast.success("Confirmed items transferred successfully");
      }
      
      // Refresh the temp issue table after transfer
      if (window.refreshTempIssueTable) {
        window.refreshTempIssueTable();
      }
    } catch (error) {
      console.error("💥 [SUBMIT] Error:", error);
      const errorMessage = error.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
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
            title="Accept LAB-OPEN items and transfer LAB-ACT items"
            disabled={tableItemCount === 0}
          >
            Submit
          </Button>
        </h1>
      </div>
      <p></p>

      <div style={{ paddingTop: "10px" }}>
        <TempIssueTable 
          onEdit={openIssueEditor} 
          username={effectiveUserDetails.user_name || null}
          onItemCountChange={setTableItemCount}
        />
      </div>

      {/* --- Modal Component for Add Issue Form --- */}
      <Modal show={showModal} onHide={handleClose} size="xl" scrollable className="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Issue Item" : "Add Issue Item"}</Modal.Title>
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
                      <Select
                        options={expiryDates}
                        value={selectedExpiryDate}
                        onChange={(selectedOption) => {
                          setSelectedExpiryDate(selectedOption);
                          if (errorMessages.expiryDate && selectedOption) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              expiryDate: "",
                            }));
                          }
                        }}
                        placeholder={expiryDates.length > 0 ? "Select Expiry Date" : "No expiry dates available"}
                        isDisabled={expiryDates.length === 0}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: errorMessages.expiryDate ? "red" : "black",
                          }),
                        }}
                      />
                      {errorMessages.expiryDate && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.expiryDate}
                        </span>
                      )}
                      {expiryDates.length === 0 && selectedItemCode && (
                        <small className="text-muted">
                          No expiry dates found for this item
                        </small>
                      )}
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Select
                        options={locations}
                        value={selectedLocation}
                        onChange={(selectedOption) => {
                          setSelectedLocation(selectedOption);
                          if (errorMessages.location && selectedOption) {
                            setErrorMessages((prev) => ({
                              ...prev,
                              location: "",
                            }));
                          }
                        }}
                        placeholder={locations.length > 0 ? "Select Location" : "No locations available"}
                        isDisabled={locations.length === 0}
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
                      {locations.length === 0 && selectedItemCode && (
                        <small className="text-muted">
                          No locations found for this item
                        </small>
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
                            selectedItemDetails,
                            selectedExpiryDate: !!selectedExpiryDate,
                            selectedLocation: !!selectedLocation
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

                          // First check if expiry date and location are selected
                          if (!selectedExpiryDate || !selectedLocation) {
                            console.log("🔢 [QUANTITY INPUT] Expiry date or location not selected");
                            setQuantityIssued("");
                            toast.error("Please select expiry date and location first to see available quantity");
                            return;
                          }

                          // Apply constraints - only check max quantity if expiry date and location are selected
                          if (numericValue <= 0) {
                            console.log("🔢 [QUANTITY INPUT] Zero or negative value - not allowed");
                            setQuantityIssued("");
                            toast.error("Quantity must be a positive number (greater than 0)");
                            return;
                          } else if (numericValue > maxQuantity && maxQuantity > 0) {
                            console.log("🔢 [QUANTITY INPUT] Exceeds max - setting to max");
                            setQuantityIssued(maxQuantity);
                            toast.error(`Maximum available quantity is ${maxQuantity}`);
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
                        min="1"
                        max={selectedItemDetails?.quantityIssued || 0}
                        disabled={!selectedExpiryDate || !selectedLocation}
                        className="custom-border"
                        style={{ 
                          borderColor: errorMessages.quantityIssued ? "red" : "black",
                          backgroundColor: (!selectedExpiryDate || !selectedLocation) ? "#f5f5f5" : "white",
                          cursor: (!selectedExpiryDate || !selectedLocation) ? "not-allowed" : "text"
                        }}
                        placeholder={(!selectedExpiryDate || !selectedLocation) ? "Select expiry date and location first" : "Enter quantity"}
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
                    <Form.Group controlId="instruction_specification">
                      <Form.Label>Instruction and Specification</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="instruction_specification"
                        required
                        value={instructionSpecification}
                        placeholder=""
                        className="custom-border"
                        style={{
                          borderColor: errorMessages.instruction_specification ? "red" : "black",
                        }}
                        onChange={(e) => {
                          setInstructionSpecification(e.target.value);
                          setErrorMessages(prev => ({...prev, instruction_specification: ""}));
                        }}
                      />
                      {errorMessages.instruction_specification && (
                        <span style={{ color: "red", fontSize: "0.85rem" }}>
                          {errorMessages.instruction_specification}
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
                        value={remarks}
                        placeholder=""
                        className="custom-border"
                        style={{
                          borderColor: errorMessages.remarks ? "red" : "black",
                        }}
                        onChange={(e) => {
                          setRemarks(e.target.value);
                          setErrorMessages(prev => ({...prev, remarks: ""}));
                        }}
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
            {isEditMode ? "Update Item" : "Add Item"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IssuedProduct;