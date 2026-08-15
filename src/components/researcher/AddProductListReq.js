import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  addItemIssueApi,
  addIssueResearcherApi,
  getSuppliersApi,
  getManufacturersApi,
  getLabassistantEmployeeApi,
  getTemptReceiveApi,
  getmanagerEmployeeApi,
  getUnitsApi,
  getProjectApi,
  getResEmployeeApi,
  addTempItemIssueApi,
  addTempToIssueApi,
  getEmployeeApi,
  getEmployeeByUsernameApi,
} from "../../services/AppinfoService";
import Select from "react-select";
import { PageLayout, PageHeader, PageBody } from "../layout/content";
import "./AddProductListReq.css";

/** Project codes are CharField labels (e.g. PROJECT_01) — always compare as strings. */
const normalizeProjectCode = (code) => String(code ?? "").trim();
const projectCodesEqual = (a, b) =>
  normalizeProjectCode(a).toLowerCase() === normalizeProjectCode(b).toLowerCase();
const projectCodeInList = (code, list = []) =>
  (list || []).some((c) => projectCodesEqual(c, code));
const itemMatchesAnyProject = (itemProjectCode, assignedList) => {
  if (itemProjectCode == null || itemProjectCode === "") return false;
  const codes = Array.isArray(itemProjectCode) ? itemProjectCode : [itemProjectCode];
  return codes.some((c) => projectCodeInList(c, assignedList));
};

/**
 * Build unique requestable items from received inventory (project-scoped stock).
 * Same catalog item may appear under multiple projects — collect all project codes.
 */
const buildItemsFromInventory = (inventoryRows, masterTypeFilter) => {
  let rows = Array.isArray(inventoryRows) ? inventoryRows : [];
  if (masterTypeFilter) {
    rows = rows.filter(
      (item) =>
        item.master_type &&
        String(item.master_type).toLowerCase() === String(masterTypeFilter).toLowerCase()
    );
  }
  // Offer items that still have usable quantity (match Lab Issue: stock || quantity_received)
  rows = rows.filter((item) => {
    const available = Number(item.stock) || Number(item.quantity_received) || 0;
    return available > 0;
  });

  const byCid = new Map();
  for (const item of rows) {
    if (item.c_id == null || !item.item_code) continue;
    const cid = item.c_id;
    const proj = item.project_code;
    const existing = byCid.get(cid);
    if (!existing) {
      byCid.set(cid, {
        value: cid,
        label: item.item_code,
        itemName: item.item_name,
        projectCode: proj != null && String(proj).trim() !== "" ? [proj] : [],
        details: { units: item.unit_measure || item.units },
      });
    } else if (
      proj != null &&
      String(proj).trim() !== "" &&
      !projectCodeInList(proj, existing.projectCode)
    ) {
      existing.projectCode.push(proj);
    }
  }

  const itemsWithProjects = Array.from(byCid.values());
  const itemsNamesWithProjects = itemsWithProjects.map((item) => ({
    value: item.value,
    label: item.itemName,
    itemCode: item.label,
    projectCode: item.projectCode,
    details: item.details,
  }));

  return { itemsWithProjects, itemsNamesWithProjects };
};

const AddProductListReq = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // Get user from Redux store (preferred over userDetails prop)
  const reduxUser = useSelector((state) => state.user.user);
  const [selectedLabAssistant, setSelectedLabAssistant] = useState("");
  const [labassistantNames, setLabassistantNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectsMap, setProjectsMap] = useState([]);
  const [message, setMessage] = useState("");
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [projectCodes, setProjectCodes] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [masterTypeList, setMasterTypeList]=useState([]);
  const [selectedCodes, setSelectedCodes] = useState(null);
  const [masterType, setMasterType] = useState("");
  const formRef = useRef(null);
  const [selectedProjectCode, setSelectedProjectCode] = useState(null);
  const [resNames, setResNames] = useState([]);
  const [selectedNames, setSelectedNames] = useState(null);
  const [managerNames, setManagerNames] = useState([]);
  const [selectedmanNames, setSelectedmanNames] = useState(null);
  const [managerProjects, setManagerProjects] = useState([]);
  const [filteredProjectsMap, setFilteredProjectsMap] = useState([]);
  const [hasProjects, setHasProjects] = useState(true);
  const [allItemsCodes, setAllItemsCodes] = useState([]); // Store all items for filtering
  const [allItemsNames, setAllItemsNames] = useState([]); // Store all items for filtering
  const [filteredItemsCodes, setFilteredItemsCodes] = useState([]);
  const [filteredItemsNames, setFilteredItemsNames] = useState([]);
  const [filteredManagerNames, setFilteredManagerNames] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedunits, setSelectedunits] = useState(null);
  const [units, setUnits] = useState([]);
  const [quantityIssued, setQuantityIssued] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    issuedTo: "",
    remarks: "",
    masterType: "",
    itemCode: "",
    itemName: "",
  });
  useEffect(() => {
    getManufacturersApi().then((data) => {
      // Ensure data is formatted correctly for react-select
      const formattedManufacturers = data.map((item) => ({
        value: item.id, // Assuming API returns an `id`
        label: item.manufacturer, // Assuming API returns a `name`
      }));
      setManufacturers(formattedManufacturers);
    });
    getSuppliersApi().then((data) => {
      setSuppliers(
        data.map((item) => ({ value: item.id, label: item.supplier }))
      );
    });
    getUnitsApi().then((data) => {
      setUnits(
        data.map((item) => ({ value: item.id, label: item.unit_measure }))
      );
    });
  }, []);
  // Function to fetch lab assistants based on lab and project
  const fetchLabAssistants = (labName, projectCode) => {
    // If researcher has no project assigned, show empty list
    if (!projectCode) {
      setLabassistantNames([]);
      return;
    }
    
    // Pass lab name and selected project code to filter lab assistants
    // Backend filters by both lab AND project (intersection)
    getLabassistantEmployeeApi(labName || null, projectCode ? [projectCode] : [])
      .then((data) => {
        console.log("Lab Assistants API Response:", data);
        setLabassistantNames(
          data.map((item) => ({ value: item, label: item }))
        );
      })
      .catch((error) => {
        console.error("Error fetching Lab Assistants Names:", error);
        setLabassistantNames([]);
      });
  };

  // Fetch lab assistants when project is selected or researcher data changes
  useEffect(() => {
    // Get researcher's lab(s)
    const researcherLabs = reduxUser?.lab || userDetails.lab || [];
    let labName = null;
    
    if (Array.isArray(researcherLabs) && researcherLabs.length > 0) {
      // Use first lab if multiple labs (backend uses icontains, so this should work)
      labName = researcherLabs[0];
    } else if (typeof researcherLabs === 'string' && researcherLabs !== 'N/A') {
      labName = researcherLabs;
    }
    
    // Get selected project code from form
    const selectedProjectCode = selectedCodes?.value || null;
    
    // Fetch lab assistants filtered by lab and selected project
    fetchLabAssistants(labName, selectedProjectCode);
  }, [selectedCodes, reduxUser?.lab, userDetails.lab]);

  useEffect(() => {
    const username = reduxUser?.user_name || userDetails.name;
    const researcherLabs = reduxUser?.lab || userDetails.lab || [];
    let labName = null;
    if (Array.isArray(researcherLabs) && researcherLabs.length > 0) {
      labName = researcherLabs[0];
    } else if (typeof researcherLabs === "string" && researcherLabs !== "N/A") {
      labName = researcherLabs;
    }

    // Item Code / Item Name from project-scoped received inventory (not Master.project_code)
    getTemptReceiveApi(labName, username)
      .then((data) => {
        const inventory = Array.isArray(data) ? data : [];
        console.log("Received inventory for request form:", inventory.length);
        const uniqueMasterType = [
          ...new Set(inventory.map((item) => item.master_type).filter(Boolean)),
        ];
        setMasterTypeList(uniqueMasterType);

        const { itemsWithProjects, itemsNamesWithProjects } = buildItemsFromInventory(
          inventory,
          masterType
        );
        setAllItemsCodes(itemsWithProjects);
        setAllItemsNames(itemsNamesWithProjects);
        console.log("Requestable items from inventory:", itemsWithProjects);
      })
      .catch((error) => {
        console.error("Error fetching received inventory for request:", error);
        setAllItemsCodes([]);
        setAllItemsNames([]);
      });

    Promise.all([getProjectApi(), getEmployeeApi()])
      .then(([projectsData, employeesData]) => {
        console.log("All Projects:", projectsData);
        console.log("All Employees:", employeesData);

        const activeProjects = projectsData.filter((item) => item.deleted === 0);
        let assignedProjectCodes = [];

        if (username) {
          const employee = employeesData.find(
            (emp) =>
              emp.emp_name &&
              username &&
              emp.emp_name.toLowerCase() === String(username).toLowerCase() &&
              emp.is_active !== false
          );

          if (employee && employee.project_code && employee.project_code.length > 0) {
            assignedProjectCodes = Array.isArray(employee.project_code)
              ? employee.project_code
              : [employee.project_code];
            console.log("Using EmpDet project codes:", assignedProjectCodes);
          } else if (reduxUser && reduxUser.project_code) {
            assignedProjectCodes = Array.isArray(reduxUser.project_code)
              ? reduxUser.project_code
              : [reduxUser.project_code];
            console.log("Using LoginCre project codes (fallback):", assignedProjectCodes);
          }
        }

        if (assignedProjectCodes.length > 0) {
          const filteredProjects = activeProjects.filter((project) =>
            projectCodeInList(project.project_code, assignedProjectCodes)
          );
          console.log("Filtered Projects (assigned only):", filteredProjects);
          setHasProjects(true);

          const projectsMapData = filteredProjects.map((item) => ({
            value: item.project_code,
            label: item.project_name,
            code: item.project_code,
          }));
          setProjectsMap(projectsMapData);
          // Project dropdown stays empty until a manager is selected
          setFilteredProjectsMap([]);
        } else {
          console.log("No assigned projects found - showing empty dropdown");
          setProjectsMap([]);
          setFilteredProjectsMap([]);
          setHasProjects(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects or employees:", error);
        setProjectsMap([]);
        setFilteredProjectsMap([]);
        setHasProjects(false);
      });

    getResEmployeeApi()
      .then((data) => {
        console.log("Received data:", data);
        setResNames(data.map((item) => ({ value: item, label: item })));
      })
      .catch((error) =>
        console.error("Error fetching Researcher Names:", error)
      );
  }, [masterType, reduxUser?.user_name, userDetails.name, reduxUser?.lab, userDetails.lab]);

  // Managers depend only on lab + selected project — never on Master Type / inventory reload
  const getResearcherLabs = () => {
    const researcherLabs = reduxUser?.lab || userDetails.lab || [];
    if (Array.isArray(researcherLabs) && researcherLabs.length > 0) {
      return researcherLabs.filter((lab) => lab && lab !== "N/A");
    }
    if (typeof researcherLabs === "string" && researcherLabs !== "N/A") {
      return [researcherLabs];
    }
    return [];
  };

  const fetchManagers = (projectCode = null) => {
    const labsToSend = getResearcherLabs();
    const projectCodes = projectCode ? [projectCode] : null;

    getmanagerEmployeeApi(
      labsToSend.length > 0 ? labsToSend : null,
      projectCodes
    )
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const managerList = list.map((item) => ({ value: item, label: item }));
        setManagerNames(managerList);
        setFilteredManagerNames(managerList);
        if (
          selectedmanNames &&
          !managerList.find((m) => m.value === selectedmanNames.value)
        ) {
          setSelectedmanNames(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching Manager Names:", error);
        setManagerNames([]);
        setFilteredManagerNames([]);
      });
  };

  useEffect(() => {
    fetchManagers(selectedCodes?.value || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCodes?.value, reduxUser?.lab, userDetails.lab]);

  // Get researcher's assigned project codes (helper function)
  const getAssignedProjectCodes = () => {
    const username = reduxUser?.user_name || userDetails.name;
    // This will be set from the projects fetch, but we need it here
    // We'll use projectsMap to get assigned codes
    return projectsMap.map(p => p.code);
  };

  // Filter items by assigned project codes
  const filterItemsByAssignedProjects = (itemsCodesList, itemsNamesList, assignedProjectCodes, preserveSelection = false) => {
    if (!assignedProjectCodes || assignedProjectCodes.length === 0) {
      // No projects assigned - show no items
      setItemsCodes([]);
      setItemsNames([]);
      setFilteredItemsCodes([]);
      setFilteredItemsNames([]);
      if (!preserveSelection) {
        setSelectedItemCode(null);
        setSelectedItemName(null);
      }
      return;
    }

    // Filter by inventory project_code(s) using string-safe comparison
    const validItemsCodes = itemsCodesList.filter((item) =>
      itemMatchesAnyProject(item.projectCode, assignedProjectCodes)
    );

    const validItemsNames = itemsNamesList.filter((item) =>
      itemMatchesAnyProject(item.projectCode, assignedProjectCodes)
    );

    console.log("Filtered items by assigned projects:", validItemsCodes.length, "out of", itemsCodesList.length);

    // Update filtered items
    setItemsCodes(validItemsCodes);
    setItemsNames(validItemsNames);
    setFilteredItemsCodes(validItemsCodes);
    setFilteredItemsNames(validItemsNames);

    // Only check and clear selection if preserveSelection is false (initial load)
    // Don't clear selection during cascading filters to avoid removing user's selection
    if (!preserveSelection && selectedItemCode) {
      const stillExists = validItemsCodes.find(item => item.value === selectedItemCode.value);
      if (!stillExists) {
        // Selected item no longer exists - clear selection only on initial load
        setSelectedItemCode(null);
        setSelectedItemName(null);
      } else {
        // Item exists - ensure item name is properly set
        const itemInList = validItemsCodes.find(item => item.value === selectedItemCode.value);
        if (itemInList && (!selectedItemName || selectedItemName.value !== itemInList.value)) {
          setSelectedItemName({
            value: itemInList.value,
            label: itemInList.itemName,
          });
        }
      }
    } else if (preserveSelection && selectedItemCode) {
      // During cascading filters, ensure selected item stays in filtered list
      const stillExists = validItemsCodes.find(item => item.value === selectedItemCode.value);
      if (!stillExists) {
        // Item was filtered out - add it back to preserve user's selection
        const itemToAdd = itemsCodesList.find(item => item.value === selectedItemCode.value);
        const nameToAdd = itemsNamesList.find(item => item.value === selectedItemCode.value);
        if (itemToAdd && nameToAdd) {
          // Add selected item back to filtered lists
          const updatedFilteredCodes = [...validItemsCodes, itemToAdd];
          const updatedFilteredNames = [...validItemsNames, nameToAdd];
          setFilteredItemsCodes(updatedFilteredCodes);
          setFilteredItemsNames(updatedFilteredNames);
          setItemsCodes(updatedFilteredCodes);
          setItemsNames(updatedFilteredNames);
        }
      }
    }
  };

  // Filter items by assigned projects after both items and projects are loaded
  // Use a ref to track if this is the initial load
  const initialLoadRef = React.useRef(true);
  
  useEffect(() => {
    if (projectsMap.length === 0 || allItemsCodes.length === 0) {
      return; // Wait for both projects and items to be loaded
    }

    const assignedProjectCodes = getAssignedProjectCodes();
    if (assignedProjectCodes.length > 0) {
      // Only preserve selection if it's not the initial load
      filterItemsByAssignedProjects(allItemsCodes, allItemsNames, assignedProjectCodes, !initialLoadRef.current);
      initialLoadRef.current = false;
    } else {
      // No projects assigned - clear items
      setItemsCodes([]);
      setItemsNames([]);
      setFilteredItemsCodes([]);
      setFilteredItemsNames([]);
      initialLoadRef.current = false;
    }
  }, [projectsMap, allItemsCodes, allItemsNames]);

  // Cascading filter: When Item Code is selected
  useEffect(() => {
    if (!selectedmanNames || !selectedmanNames.value) {
      // Projects require a manager first
      setFilteredProjectsMap([]);
      if (!selectedItemCode || !selectedItemCode.value) {
        const assignedProjectCodes = getAssignedProjectCodes();
        if (assignedProjectCodes.length > 0) {
          filterItemsByAssignedProjects(allItemsCodes, allItemsNames, assignedProjectCodes, true);
        }
      }
      return;
    }

    if (!selectedItemCode || !selectedItemCode.value) {
      // No item selected — common projects only (researcher ∩ manager)
      if (managerProjects.length > 0) {
        const filteredProjects = projectsMap.filter((project) =>
          projectCodeInList(project.code, managerProjects)
        );
        setFilteredProjectsMap(filteredProjects);
      } else {
        setFilteredProjectsMap([]);
      }

      // Reset item filters to show all (but keep the filtered items based on assigned projects)
      // Don't reset to allItemsCodes, keep the filtered ones
      const assignedProjectCodes = getAssignedProjectCodes();
      if (assignedProjectCodes.length > 0) {
        filterItemsByAssignedProjects(allItemsCodes, allItemsNames, assignedProjectCodes, true);
      }
      // Managers are loaded separately from lab + selected project (not item cascade)
      return;
    }

    // Find the selected item to get its project_code
    // Try filteredItemsCodes first (what's shown), then allItemsCodes as fallback
    let selectedItem = filteredItemsCodes.find(item => item.value === selectedItemCode.value);
    
    // If not found in filtered list, try allItemsCodes
    if (!selectedItem) {
      selectedItem = allItemsCodes.find(item => item.value === selectedItemCode.value);
    }
    
    if (!selectedItem) {
      // Item not found - this shouldn't happen, but if it does, don't clear selection
      // The item might be valid but temporarily not in the filtered list
      console.warn("Selected item not found in items list:", selectedItemCode.value);
      // Don't return - continue with the selection to preserve user's choice
      // The item will be validated when they try to submit
      return;
    }
    
    if (!selectedItem.projectCode) {
      // Item has no project code - shouldn't be selectable, but handle gracefully
      console.warn("Selected item has no project code:", selectedItemCode.value);
      return;
    }

    // Item can belong to multiple projects - get all project codes for this item
    const itemProjectCodes = Array.isArray(selectedItem.projectCode) 
      ? selectedItem.projectCode 
      : [selectedItem.projectCode];

    // Get researcher's assigned project codes
    const assignedProjectCodes = getAssignedProjectCodes();
    
    // Filter: show only project codes that are both assigned to researcher AND belong to the item
    const validProjectCodes = itemProjectCodes.filter(code => 
      projectCodeInList(code, assignedProjectCodes)
    );

    // Filter projects
    let filteredProjects = projectsMap.filter(project => 
      projectCodeInList(project.code, validProjectCodes)
    );

    // Manager is required — further filter by manager's projects (empty if none loaded yet)
    if (managerProjects.length > 0) {
      filteredProjects = filteredProjects.filter((project) =>
        projectCodeInList(project.code, managerProjects)
      );
    } else {
      filteredProjects = [];
    }

    setFilteredProjectsMap(filteredProjects);

    // If selected project is not in filtered list, clear it
    if (selectedCodes && !filteredProjects.find(p => projectCodesEqual(p.code, selectedCodes.value))) {
      setSelectedCodes(null);
      setSelectedProject("");
      setSelectedLabAssistant(null);
      setLabassistantNames([]);
    }

    // Filter lab assistants by valid project codes (if project is selected)
    if (selectedCodes && projectCodeInList(selectedCodes.value, validProjectCodes)) {
      const researcherLabs = reduxUser?.lab || userDetails.lab || [];
      let labName = null;
      if (Array.isArray(researcherLabs) && researcherLabs.length > 0) {
        labName = researcherLabs[0];
      } else if (typeof researcherLabs === 'string' && researcherLabs !== 'N/A') {
        labName = researcherLabs;
      }
      fetchLabAssistants(labName, selectedCodes.value);
    } else if (!selectedCodes) {
      // No project selected, clear lab assistants
      setLabassistantNames([]);
      if (!selectedLabAssistant) {
        setSelectedLabAssistant(null);
      }
    }

  }, [selectedItemCode, projectsMap, selectedmanNames, managerProjects, allItemsCodes, allItemsNames]);

  // Cascading filter: When Project Code is selected
  useEffect(() => {
    if (!selectedCodes || !selectedCodes.value) {
      // No project selected - show all items (filtered by item selection if any)
      if (selectedItemCode) {
        // If item is selected, keep its project filter
        const selectedItem = allItemsCodes.find(item => item.value === selectedItemCode.value);
        if (selectedItem && selectedItem.projectCode) {
          const itemProjectCodes = Array.isArray(selectedItem.projectCode) 
            ? selectedItem.projectCode 
            : [selectedItem.projectCode];
          const assignedProjectCodes = getAssignedProjectCodes();
          const validProjectCodes = itemProjectCodes.filter(code => 
            projectCodeInList(code, assignedProjectCodes)
          );
          const filteredItems = allItemsCodes.filter(item =>
            itemMatchesAnyProject(item.projectCode, validProjectCodes)
          );
          const filteredNames = allItemsNames.filter(item =>
            itemMatchesAnyProject(item.projectCode, validProjectCodes)
          );
          setFilteredItemsCodes(filteredItems);
          setFilteredItemsNames(filteredNames);
          setItemsCodes(filteredItems);
          setItemsNames(filteredNames);
        }
      } else {
        // No item selected - show all items already scoped to assigned projects
        const assignedProjectCodes = getAssignedProjectCodes();
        if (assignedProjectCodes.length > 0) {
          filterItemsByAssignedProjects(allItemsCodes, allItemsNames, assignedProjectCodes, true);
        } else {
          setFilteredItemsCodes(allItemsCodes);
          setFilteredItemsNames(allItemsNames);
          setItemsCodes(allItemsCodes);
          setItemsNames(allItemsNames);
        }
      }
      
      // Clear lab assistants (managers reload via selectedCodes effect only)
      setLabassistantNames([]);
      setSelectedLabAssistant(null);
      return;
    }

    const selectedProjectCode = selectedCodes.value;

    // Filter items: show only items that belong to selected project AND are assigned to researcher
    const assignedProjectCodes = getAssignedProjectCodes();
    if (!projectCodeInList(selectedProjectCode, assignedProjectCodes)) {
      // Project not assigned - shouldn't happen, but handle it
      setFilteredItemsCodes([]);
      setFilteredItemsNames([]);
      setItemsCodes([]);
      setItemsNames([]);
      return;
    }

    const filteredItems = allItemsCodes.filter(item =>
      itemMatchesAnyProject(item.projectCode, [selectedProjectCode])
    );

    const filteredNames = allItemsNames.filter(item =>
      itemMatchesAnyProject(item.projectCode, [selectedProjectCode])
    );

    setFilteredItemsCodes(filteredItems);
    setFilteredItemsNames(filteredNames);
    setItemsCodes(filteredItems);
    setItemsNames(filteredNames);

    // If selected item is not in filtered list, clear it
    if (selectedItemCode && !filteredItems.find(item => item.value === selectedItemCode.value)) {
      setSelectedItemCode(null);
      setSelectedItemName(null);
    }

    // Fetch lab assistants for selected project (managers handled by dedicated effect)
    const researcherLabs = reduxUser?.lab || userDetails.lab || [];
    let labName = null;
    if (Array.isArray(researcherLabs) && researcherLabs.length > 0) {
      labName = researcherLabs[0];
    } else if (typeof researcherLabs === 'string' && researcherLabs !== 'N/A') {
      labName = researcherLabs;
    }
    fetchLabAssistants(labName, selectedProjectCode);

  }, [selectedCodes, allItemsCodes, allItemsNames, projectsMap, selectedItemCode]);

  // Cascading filter: When Manager is selected (filter projects by manager — do not reload managers)
  useEffect(() => {
    if (!selectedmanNames || !selectedmanNames.value) {
      // No manager — project dropdown stays empty/disabled until a manager is chosen
      setFilteredProjectsMap([]);
      setManagerProjects([]);
      setSelectedCodes(null);
      setSelectedProject("");
      setSelectedLabAssistant(null);
      setLabassistantNames([]);
      return;
    }

    // Fetch manager's employee data to get their projects (person lookup, not lab roster)
    getEmployeeByUsernameApi(selectedmanNames.value)
      .then((employeeData) => {
        console.log("Manager employee data:", employeeData);

        const rows = Array.isArray(employeeData)
          ? employeeData
          : employeeData && typeof employeeData === "object"
            ? [employeeData]
            : [];

        const managerName = String(selectedmanNames.value || "").toLowerCase();
        const manager =
          rows.find(
            (emp) =>
              emp.emp_name &&
              String(emp.emp_name).toLowerCase() === managerName
          ) || null;

        let managerProjectCodes = [];
        if (manager && manager.project_code) {
          managerProjectCodes = Array.isArray(manager.project_code)
            ? manager.project_code
            : [manager.project_code];
        }

        setManagerProjects(managerProjectCodes);

        let projectsToFilter = projectsMap;

        if (selectedItemCode) {
          const selectedItem = allItemsCodes.find(item => item.value === selectedItemCode.value);
          if (selectedItem && selectedItem.projectCode) {
            const itemProjectCodes = Array.isArray(selectedItem.projectCode) 
              ? selectedItem.projectCode 
              : [selectedItem.projectCode];
            const assignedProjectCodes = getAssignedProjectCodes();
            const validProjectCodes = itemProjectCodes.filter(code => 
              projectCodeInList(code, assignedProjectCodes)
            );
            projectsToFilter = projectsMap.filter(project => 
              projectCodeInList(project.code, validProjectCodes)
            );
          }
        }

        if (managerProjectCodes.length > 0) {
          const commonProjects = projectsToFilter.filter((project) =>
            projectCodeInList(project.code, managerProjectCodes)
          );
          console.log("Common projects (researcher & manager):", commonProjects);
          setFilteredProjectsMap(commonProjects);
          
          if (selectedCodes && !commonProjects.find(p => projectCodesEqual(p.code, selectedCodes.value))) {
            setSelectedCodes(null);
            setSelectedProject("");
            setSelectedLabAssistant(null);
            setLabassistantNames([]);
          }
        } else {
          setFilteredProjectsMap([]);
          setSelectedCodes(null);
          setSelectedProject("");
          setSelectedLabAssistant(null);
          setLabassistantNames([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching manager's projects:", error);
        setFilteredProjectsMap([]);
        setManagerProjects([]);
        setSelectedCodes(null);
        setSelectedProject("");
        setSelectedLabAssistant(null);
        setLabassistantNames([]);
      });
  }, [selectedmanNames, projectsMap, selectedItemCode, allItemsCodes]);


  const handleProjectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue);

    // Find selected project and update projectCode
    const selectedProj = projectsMap.find(
      (proj) => proj.value === selectedValue
    );
    if (selectedProj) {
      setSelectedCodes({ value: selectedProj.code, label: selectedProj.code });
    } else {
      setSelectedCodes(null);
    }
  };

  const handleItemCodeChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedItemCode(null);
      setSelectedItemName(null);
      return;
    }
    
    // Use filteredItemsCodes to find the selected item (it's what's shown in the dropdown)
    const selectedItem = filteredItemsCodes.find(
      (item) => item.value === selectedOption.value
    ) || allItemsCodes.find(
      (item) => item.value === selectedOption.value
    );
    
    if (selectedItem) {
      // Set both item code and item name together to avoid race conditions
      setSelectedItemCode(selectedOption);
      setSelectedItemName({
        value: selectedItem.value,
        label: selectedItem.itemName,
      });
    } else {
      // Item not found - this shouldn't happen if item is in dropdown
      console.warn("Selected item not found in items list:", selectedOption.value);
      // Still set the selection - the item might be valid but not in filtered list yet
      setSelectedItemCode(selectedOption);
    }
  };

  const handleItemNameChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedItemName(null);
      setSelectedItemCode(null);
      return;
    }
    
    setSelectedItemName(selectedOption);
    // Use filteredItemsNames to find the selected item
    const selectedItem = filteredItemsNames.find(
      (item) => item.value === selectedOption.value
    ) || allItemsNames.find(
      (item) => item.value === selectedOption.value
    );
    
    if (selectedItem) {
      setSelectedItemCode({
        value: selectedItem.value,
        label: selectedItem.itemCode,
      });
    } else {
      // Item not found - clear selection
      setSelectedItemName(null);
      setSelectedItemCode(null);
    }
  };

  console.log("Researched Names:", resNames); // Log state to verify

  const handleAdd = () => {
    // Prevent submission if researcher has no projects assigned
    if (!hasProjects) {
      toast.error("You have no projects assigned. Please contact your administrator to assign projects before requesting items.");
      return;
    }

    const formData = new FormData(formRef.current);
    let newErrorMessages = {};

    if (!masterType) newErrorMessages.masterType = "Please fill this field";
    if (!selectedItemCode) newErrorMessages.itemCode = "Please fill this field";
    if (!selectedItemName) newErrorMessages.itemName = "Please fill this field";
    if (!formData.get("remarks"))
      newErrorMessages.remarks = "Please fill this field";
    if (!selectedmanNames)
      newErrorMessages.supervisor = "Please fill this field";
    if (!selectedCodes) newErrorMessages.project = "Please fill this field";
    if (!selectedLabAssistant)
      newErrorMessages.labAssistant = "Please fill this field";
    // Use Redux user if available, fallback to userDetails prop
    const username = reduxUser?.user_name || userDetails.name;
    if (!username) newErrorMessages.issuedTo = "Please fill this field";

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      // alert("Please fill all required fields");
      return;
    }

    const issueData = {
      c_id: selectedItemCode.value,
      project_code: selectedCodes.value,
      issued_to: username,
      project_name: selectedCodes.label,
      supervisor_name: selectedmanNames.value,
      remarks: formData.get("remarks"),
      master_type: masterType,
      item_name: selectedItemName.label,
      item_code: selectedItemCode.label,
      lab_assistant_name: selectedLabAssistant.label,
      quantity_issued: quantityIssued || null,
    };

    addIssueResearcherApi(issueData)
      .then(() => {
        toast.success("Request added successfully");
        formRef.current.reset();
        setSelectedItem(null);
        setSelectedItemCode(null);
        setSelectedItemName(null);
        setSelectedCodes(null);
        setSelectedProjectCode(null);
        setSelectedmanNames(null);
        setMasterType("");
        setSelectedNames(null);
        setSelectedLabAssistant(null);
        setQuantityIssued('');
        setErrorMessages({});
      })
      .catch((error) => {
        console.error("Failed to Add Inventory Data", error);
        toast.error("Failed to Add Inventory. Check console for details.");
      });
  };

  const selectControlStyles = (hasError) => ({
    control: (provided) => ({
      ...provided,
      borderColor: hasError ? "#dc2626" : "#e2e8f0",
      minHeight: "2.25rem",
      borderRadius: "0.5rem",
      boxShadow: "none",
      fontSize: "0.875rem",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 0.75rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "#64748b",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "#09090b",
    }),
  });

  return (
    <PageLayout>
      <PageHeader title="Request form" />

      <PageBody>
        <div className="product-req-page">
          {!hasProjects && (
            <div className="product-req-warning" role="alert">
              <strong>No Projects Assigned</strong>
              You have no projects assigned. Please contact your administrator to assign projects before requesting items.
            </div>
          )}

          <section className="project-panel" aria-label="Item request form">
            <div className="product-req-panel-heading">
              <h2 className="product-req-panel-title">New request</h2>
              <p className="product-req-panel-description">
                Fill in the details below to submit an item request to your manager and lab assistant.
              </p>
            </div>

            <div className="product-req-form-body">
              <Form
                className="product-req-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd();
                }}
                ref={formRef}
              >
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="masterType" className="project-field">
                      <Form.Label>Master Type</Form.Label>
                      <Form.Select
                        required
                        value={masterType}
                        className={`project-field-input${errorMessages.masterType ? " project-field-input--error" : ""}`}
                        onChange={(e) => setMasterType(e.target.value)}
                      >
                        <option value="">Select Master Type</option>
                        {masterTypeList.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Form.Select>
                      {errorMessages.masterType && (
                        <span className="project-field-error">
                          {errorMessages.masterType}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="itemCode" className="product-req-select-field">
                      <Form.Label>Item Code</Form.Label>
                      <Select
                        options={filteredItemsCodes.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        required
                        value={selectedItemCode}
                        onChange={handleItemCodeChange}
                        placeholder={filteredItemsCodes.length === 0 ? "No items available" : "Select Item Code"}
                        isDisabled={filteredItemsCodes.length === 0}
                        styles={selectControlStyles(!!errorMessages.itemCode)}
                      />
                      {errorMessages.itemCode && (
                        <span className="project-field-error">
                          {errorMessages.itemCode}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="itemName" className="product-req-select-field">
                      <Form.Label>Item Name</Form.Label>
                      <Select
                        options={filteredItemsNames.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        required
                        value={selectedItemName}
                        onChange={handleItemNameChange}
                        placeholder={filteredItemsNames.length === 0 ? "No items available" : "Select Item Name"}
                        isDisabled={filteredItemsNames.length === 0}
                        styles={selectControlStyles(!!errorMessages.itemName)}
                      />
                      {errorMessages.itemName && (
                        <span className="project-field-error">
                          {errorMessages.itemName}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="managerName" className="product-req-select-field">
                      <Form.Label>Manager</Form.Label>
                      <Select
                        required
                        options={filteredManagerNames}
                        value={selectedmanNames}
                        onChange={setSelectedmanNames}
                        placeholder={filteredManagerNames.length === 0 ? "No managers available" : "Select Manager Name"}
                        isDisabled={filteredManagerNames.length === 0}
                        styles={selectControlStyles(!!errorMessages.supervisor)}
                      />
                      {errorMessages.supervisor && (
                        <span className="project-field-error">
                          {errorMessages.supervisor}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="projectCode" className="product-req-select-field">
                      <Form.Label>Project Code</Form.Label>
                      <Select
                        value={selectedCodes}
                        onChange={(selectedOption) => {
                          setSelectedCodes(selectedOption);
                          const correspondingProject = filteredProjectsMap.find(
                            (p) => p.code === selectedOption.value
                          );
                          if (correspondingProject) {
                            setSelectedProject({
                              value: correspondingProject.value,
                              label: correspondingProject.label,
                            });
                          }
                        }}
                        options={filteredProjectsMap.map((item) => ({
                          value: item.code,
                          label: item.code,
                        }))}
                        placeholder={
                          !selectedmanNames
                            ? "Select a manager first"
                            : filteredProjectsMap.length === 0
                              ? "No projects available"
                              : "Select Project Code"
                        }
                        isDisabled={!selectedmanNames || filteredProjectsMap.length === 0}
                        styles={selectControlStyles(!!errorMessages.project)}
                      />
                      {errorMessages.project && (
                        <span className="project-field-error">
                          {errorMessages.project}
                        </span>
                      )}
                      {!hasProjects && (
                        <span className="project-field-hint project-field-hint--warning">
                          No projects assigned to researcher
                        </span>
                      )}
                      {filteredProjectsMap.length === 0 && selectedmanNames && hasProjects && (
                        <span className="project-field-hint">
                          No common projects between researcher and selected manager
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="projectName" className="product-req-select-field">
                      <Form.Label>Project Name</Form.Label>
                      <Select
                        value={selectedProject}
                        onChange={(selectedOption) => {
                          setSelectedProject(selectedOption);
                          const correspondingProject = filteredProjectsMap.find(
                            (p) => p.label === selectedOption.label
                          );
                          if (correspondingProject) {
                            setSelectedCodes({
                              value: correspondingProject.code,
                              label: correspondingProject.code,
                            });
                          }
                        }}
                        options={filteredProjectsMap.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        placeholder={
                          !selectedmanNames
                            ? "Select a manager first"
                            : filteredProjectsMap.length === 0
                              ? "No projects available"
                              : "Select Project Name"
                        }
                        isDisabled={!selectedmanNames || filteredProjectsMap.length === 0}
                        styles={selectControlStyles(!!errorMessages.project)}
                      />
                      {!hasProjects && (
                        <span className="project-field-hint project-field-hint--warning">
                          No projects assigned to researcher
                        </span>
                      )}
                      {filteredProjectsMap.length === 0 && selectedmanNames && hasProjects && (
                        <span className="project-field-hint">
                          No common projects between researcher and selected manager
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="remarks" className="project-field">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        type="text"
                        name="remarks"
                        required
                        placeholder=""
                        className={`project-field-input${errorMessages.remarks ? " project-field-input--error" : ""}`}
                      />
                      {errorMessages.remarks && (
                        <span className="project-field-error">
                          {errorMessages.remarks}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="issuedTo" className="project-field">
                      <Form.Label>Requested By</Form.Label>
                      <Form.Control
                        type="text"
                        name="issuedTo"
                        value={reduxUser?.user_name || userDetails.name}
                        readOnly
                        className="project-field-input"
                      />
                      {errorMessages.issuedTo && (
                        <span className="project-field-error">
                          {errorMessages.issuedTo}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="labAssistantName" className="product-req-select-field">
                      <Form.Label>Select Lab Assistant</Form.Label>
                      <Select
                        options={labassistantNames}
                        value={selectedLabAssistant}
                        onChange={setSelectedLabAssistant}
                        placeholder="Lab Assistant Name"
                        styles={selectControlStyles(!!errorMessages.labAssistant)}
                      />
                      {errorMessages.labAssistant && (
                        <span className="project-field-error">
                          {errorMessages.labAssistant}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="quantityIssued" className="project-field">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantityIssued"
                        min="1"
                        value={quantityIssued}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseInt(value) >= 1)) {
                            setQuantityIssued(value);
                          }
                        }}
                        placeholder="Optional"
                        className="project-field-input"
                      />
                      <span className="project-field-hint">
                        Quantity can be adjusted by Lab Assistant before issuing
                      </span>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>

              <div className="product-req-form-actions">
                <Button
                  variant="primary"
                  onClick={handleAdd}
                  disabled={!hasProjects || !selectedItemCode || !selectedCodes || !selectedmanNames || !selectedLabAssistant}
                  className="product-req-submit-btn"
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </section>
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default AddProductListReq;
