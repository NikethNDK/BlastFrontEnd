import React, { useEffect, useState, useRef } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import {
  addItemIssueApi,
  addIssueResearcherApi,
  getSuppliersApi,
  getManufacturersApi,
  getLabassistantEmployeeApi,
  getMasterApi,
  getmanagerEmployeeApi,
  getUnitsApi,
  getProjectApi,
  getResEmployeeApi,
  addTempItemIssueApi,
  addTempToIssueApi,
  getEmployeeApi,
} from "../../services/AppinfoService";
// import '../../inventory/formBorder.css';
import Select from "react-select";
import TempIssueTable from "../Lab1/issue/TempIssueTable";
import ResearcherNavigation from "./ResearcherNavigation";
import { Heading2 } from "lucide-react";
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
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedunits, setSelectedunits] = useState(null);
  const [units, setUnits] = useState([]);
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
    // Get username for filtering (used in both API calls)
    const username = reduxUser?.user_name || userDetails.name;
    
    // Fetch project codes
    // Pass username to filter items by researcher's lab and projects
    getMasterApi(null, username)
      .then((data) => {
        // Filter data based on masterType
        console.log("Before selection master type",data)
        const uniqueMasterType=[...new Set(data.map((item)=>item.master_type))]
        setMasterTypeList(uniqueMasterType)
        
        if (masterType) {
          data = data.filter((item) => item.master_type === masterType);
        }
        console.log("After selecting master type",data)
        // Set items codes and names
        setItemsCodes(
          data.map((item) => ({
            value: item.c_id,
            label: item.item_code,
            itemName: item.item_name,
            details: { units: item.units },
          }))
        );
        console.log("item codes in the addProduct",itemsCodes)
        setItemsNames(
          data.map((item) => ({
            value: item.c_id,
            label: item.item_name,
            itemCode: item.label,
            details: { units: item.units },
          }))
        );
      })
      .catch((error) => console.error("Error fetching project codes:", error));
    //Fetch Projects codes
    
    // Fetch all projects and employee data in parallel
    Promise.all([getProjectApi(), getEmployeeApi()])
      .then(([projectsData, employeesData]) => {
        console.log("All Projects:", projectsData);
        console.log("All Employees:", employeesData);

        // Filter only active projects
        const activeProjects = projectsData.filter((item) => item.deleted === 0);

        // Get researcher's assigned project codes
        let assignedProjectCodes = [];
        
        if (username) {
          // Try to find employee record (EmpDet) - preferred source
          const employee = employeesData.find(
            (emp) => emp.emp_name === username && emp.is_active !== false
          );
          
          if (employee && employee.project_code && employee.project_code.length > 0) {
            // Use EmpDet.project_code (authoritative source)
            assignedProjectCodes = Array.isArray(employee.project_code)
              ? employee.project_code
              : [employee.project_code];
            console.log("Using EmpDet project codes:", assignedProjectCodes);
          } else if (reduxUser && reduxUser.project_code) {
            // Fallback to LoginCre.project_code if EmpDet not found
            assignedProjectCodes = Array.isArray(reduxUser.project_code)
              ? reduxUser.project_code
              : [reduxUser.project_code];
            console.log("Using LoginCre project codes (fallback):", assignedProjectCodes);
          }
        }

        // Filter projects to only show assigned ones
        let filteredProjects = activeProjects;
        if (assignedProjectCodes.length > 0) {
          filteredProjects = activeProjects.filter((project) =>
            assignedProjectCodes.includes(project.project_code)
          );
          console.log("Filtered Projects (assigned only):", filteredProjects);
        } else {
          console.log("No assigned projects found - showing empty dropdown");
        }

        setProjectsMap(
          filteredProjects.map((item) => ({
            value: item.project_code,
            label: item.project_name,
            code: item.project_code,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching projects or employees:", error);
        // Fallback: show all active projects if fetch fails
        getProjectApi().then((data) => {
          const activeProjects = data.filter((item) => item.deleted === 0);
          setProjectsMap(
            activeProjects.map((item) => ({
              value: item.project_code,
              label: item.project_name,
              code: item.project_code,
            }))
          );
        });
      });
    //Fetch Projects codes
    getResEmployeeApi()
      .then((data) => {
        console.log("Received data:", data); // Log received data
        setResNames(data.map((item) => ({ value: item, label: item })));
      })
      .catch((error) =>
        console.error("Error fetching Researcher Names:", error)
      );
    // Get researcher's lab(s) for filtering managers
    // Redux user.lab is an array of lab names (from LoginSerializer)
    // userDetails.lab might be string or array
    const researcherLabs = reduxUser?.lab || userDetails.lab || [];
    let labName = null;
    
    if (Array.isArray(researcherLabs) && researcherLabs.length > 0) {
      // Use first lab if multiple labs (backend uses icontains, so this should work)
      labName = researcherLabs[0];
    } else if (typeof researcherLabs === 'string' && researcherLabs !== 'N/A') {
      labName = researcherLabs;
    }
    
    // Pass lab name to filter managers by researcher's lab
    // Backend returns all managers if lab param is missing (optional filtering)
    getmanagerEmployeeApi(labName || null)
      .then((data) => {
        console.log("Received manager data:", data); // Log received data
        setManagerNames(data.map((item) => ({ value: item, label: item })));
      })
      .catch((error) =>
        console.error("Error fetching Manager Names:", error)
      );
  }, [masterType, reduxUser?.user_name, userDetails.name]);
  const filteredItemsCodes = itemsCodes.filter(
    (item) => item.details.masterType === masterType
  );

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
    setSelectedItemCode(selectedOption);
    const selectedItem = itemsCodes.find(
      (item) => item.value === selectedOption.value
    );
    setSelectedItemName({
      value: selectedItem.value,
      label: selectedItem.itemName,
    });
    // setSelectedItemDetails(selectedItem.details);
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
    // setSelectedItemDetails(selectedItem.details);
  };

  console.log("Researched Names:", resNames); // Log state to verify

  const handleAdd = () => {
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
    };

    addIssueResearcherApi(issueData)
      .then(() => {
        alert("Request added successfully");
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
        setErrorMessages({});
      })
      .catch((error) => {
        console.error("Failed to Add Inventory Data", error);
        alert("Failed to Add Inventory. Check console for details.");
      });
  };

  return (
    <div
  style={{
    margin: "5px",
    padding: "10px",
  }}
>
      <div>
        <h2 style={{ textAlign: "center", color: "black" }}>
          Request Form
          {/* <Button onClick={handleTransferData} style={{float: 'right'}}>Submit</Button> */}
        </h2>
      </div>

      <p></p>
      <div style={{
    padding: "10px",
    border: "1px solid #ccc", // gray border
    borderRadius: "5px",       // optional, rounded corners
    width: "80%",
    margin: "0 auto",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)" // subtle shadow
  }}> 
        <Row>
          <Col sm={12}>
            {/* <Form onSubmit={handleAdd} ref={formRef}> */}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd();
              }}
              ref={formRef}
            >
              <Row>
                <Col>                 <Form.Group controlId="masterType">
                    <Form.Label style={{ marginRight: "8px" }}>
                      Master Type
                    </Form.Label>
                    <select
                      required
                      value={masterType}
                      className="form-control"
                      style={{
                        borderColor: "black",
                        display: "inline-block", // Add this line
                        marginRight: "30px", // Make sure marginRight is still specified
                      }}
                      onChange={(e) => setMasterType(e.target.value)}
                    >
                      <option>Select Master Type</option>
                      {masterTypeList.map((masterType)=>{
                        return (
                          <option value={masterType}>{masterType}</option>
                        )
                      })}
                    </select>
                    {errorMessages.masterType && (
                      <div style={{ color: "red", marginTop: "5px" }}>
                        {errorMessages.masterType}
                      </div>
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
                      required
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
                    {errorMessages.itemCode && (
                      <div style={{ color: "red", marginTop: "5px" }}>
                        {errorMessages.itemCode}
                      </div>
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
                      required
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
                    {errorMessages.itemName && (
                      <div style={{ color: "red", marginTop: "5px" }}>
                        {errorMessages.itemName}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <p></p>

              <Row></Row>
              <p></p>

              <Row>
                <Col>
                  <Form.Group controlId="managerName">
                    <Form.Label>Manager</Form.Label>
                    <Select
                      required
                      options={managerNames}
                      value={selectedmanNames}
                      onChange={setSelectedmanNames}
                      placeholder="Select Manager Name"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: "black",
                        }),
                      }}
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.remarks}
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
                      {projectsMap.map((proj) => (
                        <option key={proj.value} value={proj.value}>
                          {proj.label}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.remarks}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="projectCode">
                    <Form.Label>Project Code</Form.Label>
                    <Select
                      value={selectedCodes}
                      placeholder="Project Code"
                      required
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: "black",
                        }),
                      }}
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.remarks}
                  </span>
                </Col> */}
                <Col>
                  <Form.Group controlId="projectCode">
                    <Form.Label>Project Code</Form.Label>
                    <Select
                      value={selectedCodes}
                      onChange={(selectedOption) => {
                        setSelectedCodes(selectedOption);
                        // Automatically update project name
                        const correspondingProject = projectsMap.find(
                          (p) => p.code === selectedOption.value
                        );
                        setSelectedProject({
                          value: correspondingProject.value,
                          label: correspondingProject.label,
                        });
                      }}
                      options={projectsMap.map((item) => ({
                        value: item.code,
                        label: item.code,
                      }))}
                      placeholder="Select Project Code"
                    />
                    {errorMessages.project && (
                      <span className="text-danger">
                        {errorMessages.project}
                      </span>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group controlId="projectName">
                    <Form.Label>Project Name</Form.Label>
                    <Select
                      value={selectedProject}
                      onChange={(selectedOption) => {
                        setSelectedProject(selectedOption);
                        // Automatically update project code
                        const correspondingProject = projectsMap.find(
                          (p) => p.label === selectedOption.label
                        );
                        setSelectedCodes({
                          value: correspondingProject.code,
                          label: correspondingProject.code,
                        });
                      }}
                      options={projectsMap.map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                      placeholder="Select Project Name"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <p></p>
              <Row>
                {" "}
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
                <Col>
                  <Form.Group controlId="issuedTo">
                    <Form.Label>Requested By</Form.Label>
                    <Form.Control
                      type="text"
                      name="issuedTo"
                      value={reduxUser?.user_name || userDetails.name}
                      readOnly
                      style={{ borderColor: "black" }}
                    />
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.issuedTo}
                  </span>
                </Col>
                <Col>
                  <Form.Group controlId="labAssistantName">
                    <Form.Label>Select Lab Assistant</Form.Label>
                    <Select
                      options={labassistantNames}
                      value={selectedLabAssistant}
                      onChange={setSelectedLabAssistant}
                      placeholder="Lab Assistant Name"
                    >
                      <option value="">Select Lab Assistant</option>
                      {labassistantNames.map((lab_assistants) => (
                        <option
                          key={lab_assistants.value}
                          value={lab_assistants.value}
                        >
                          {lab_assistants.label}
                        </option>
                      ))}
                    </Select>
                  </Form.Group>
                  <span style={{ color: "red", float: "right" }}>
                    {errorMessages.remarks}
                  </span>
                </Col>
              </Row>
            </Form>
            <Button
              variant="primary"
              onClick={handleAdd}
              style={{ width: "25%", marginLeft: "40%", marginTop: "40px" }}
            >
              Submit Request
            </Button>
          </Col>
        </Row>
      </div>
      {/* <div style={{paddingTop: '10px' }}>
                <TempIssueTable />
            </div> */}
    </div>
  );
};

export default AddProductListReq;
