import React, { useEffect, useState, useRef } from "react";
import { Modal, Col, Row, Form, Button } from "react-bootstrap";
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
  const [quantityIssued, setQuantityIssued] = useState("");
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

  // State to hold temporary items
  const [tempItems, setTempItems] = useState([]);

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

  // const handleProjectChange = (selectedOption) => {
  //   setSelectedProject(selectedOption);
  //   const project = projects.find(
  //     (proj) => proj.value === selectedOption.value
  //   );
  //   if (project) {
  //     setSelectedCodes({ value: project.code, label: project.code });
  //   }
  // };

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
    if (selectedItemCode && selectedProject && expiryDate) {
      getTemptReceiveApi()
        .then((data) => {
          const matchedItem = data.find(
            (item) =>
              String(item.item_code).toLowerCase() ===
                String(selectedItemCode.label).toLowerCase() &&
              String(item.project_code).toLowerCase() ===
                String(selectedProject.value).toLowerCase() &&
              String(item.expiry_date) === String(expiryDate)
          );

          if (matchedItem) {
            setQuantityIssued(matchedItem.quantity_received);
            setSelectedItemDetails({
              quantityIssued: matchedItem.quantity_received,
            });
          } else {
            setQuantityIssued("");
          }
        })
        .catch((error) => console.error("Error fetching quantity:", error));
    }
  }, [selectedItemCode, selectedProject, expiryDate]);

  useEffect(() => {
    if (!masterType) return;

    getTemptReceiveApi()
      .then((data) => {
        if (masterType) {
          data = data.filter((item) => item.master_type === masterType);
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

        setItemsNames(uniqueNames);
      })
      .catch((error) => console.error("Error fetching project codes:", error));

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
  }, [masterType, selectedNames]);

  const handleItemCodeChange = (selectedOption) => {
    setSelectedItemCode(selectedOption);
    const item = itemsCodes.find((item) => item.value === selectedOption.value);
    if (item) {
      setSelectedItemName({ value: item.value, label: item.itemName });
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

  // const handleAdd = () => {
  //   const formData = new FormData(formRef.current);
  //   const newErrorMessages = { ...errorMessages };

  //   // Check if any required field is empty
  //   const emptyFields = ["quantityIssued", "remarks"].filter((field) => {
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

  //   const issueData = {
  //     c_id: selectedItemCode.value,
  //     quantity_issued: formData.get("quantityIssued"),
  //     issued_to: selectedNames?.value || "",
  //     project_code: selectedCodes.value,
  //     researcher_name: selectedNames.value,
  //     remarks: formData.get("remarks"),
  //     instruction_specification: formData.get("issuedTo"),
  //     location: selectedLocations ? selectedLocations.label : "",
  //     master_type: masterType ? masterType : "",
  //     item_name: selectedItemName ? selectedItemName.label : "",
  //     item_code: selectedItemCode ? selectedItemCode.label : "",
  //   };

  //   addTempItemIssueApi(issueData)
  //     .then((result) => {
  //       window.alert("Issue added successfully");
  //       setSelectedItem(null); // Clear selected item
  //       setSelectedItemCode(null);
  //       setSelectedItemName(null);
  //       setSelectedNames(null);
  //       setSelectedLocations(null);
  //       setSelectedCodes(null);
  //       setMasterType("");
  //       setSelectedProject(null);
  //       // ✅ Reset form fields
  //       formRef.current.reset();
  //     })
  //     .catch((error) => {
  //       console.error("Failed to Add Inventory Data", error); // Log the error to the console
  //       alert("Failed to Add Inventory. Check console for details.");
  //     });
  // };
  const handleAdd = () => {
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
      newErrors.issuedTo = "Please fill this field ";
      hasError = true;
    }

    if (!selectedCodes) {
      newErrors.projectCode = "Please fill this field";
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
        window.alert("Issue added successfully");
        formRef.current.reset();
        setSelectedItem(null);
        setSelectedItemCode(null);
        setSelectedItemName(null);
        setSelectedNames(null);
        setSelectedLocations(null);
        setSelectedCodes(null);
        setMasterType("");
        setSelectedProject(null);
        setErrorMessages({}); // Clear errors
      })
      .catch((error) => {
        console.error("Failed to Add Inventory Data", error);
        alert("Failed to Add Inventory. Check console for details.");
      });
  };
  const handleTransferData = async () => {
    try {
      const response = await fetch("http://localhost:8000/transfer/issue/", {
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
    <div style={{ marginTop: "1px", width: "100%" }}>
      <div>
        <h2 style={{ textAlign: "center", color: "black" }}>Add Issue</h2>
        <Button
          variant="primary"
          onClick={handleAdd}
          style={{
            width: "88px",
            marginLeft: "71%",
            marginTop: "-5%",
          }}
        >
          Add
        </Button>
        <Button
          onClick={handleTransferData}
          style={{ marginTop: "-9%", marginLeft: "62%" }}
        >
          Submit
        </Button>
      </div>
      <p></p>

      <div>
        <Row>
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
                      <small style={{ color: "red" }}>
                        {errorMessages.masterType}
                      </small>
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
                      <small style={{ color: "red" }}>
                        {errorMessages.itemCode}
                      </small>
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
                      <small style={{ color: "red" }}>
                        {errorMessages.itemName}
                      </small>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <p></p>

              {/* <Row>
                <Form.Group controlId="quantityIssued">
                  <Form.Label>Quantity Issued</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantityIssued"
                    value={quantityIssued}
                    onChange={(e) => {
                      const enteredValue = e.target.value
                        ? parseInt(e.target.value, 10)
                        : "";
                      const maxQuantity =
                        selectedItemDetails?.quantityIssued || 0;

                      if (enteredValue > maxQuantity) {
                        setQuantityIssued(maxQuantity);
                      } else if (enteredValue < 0) {
                        setQuantityIssued(0);
                      } else {
                        setQuantityIssued(enteredValue);
                      }
                    }}
                    min="0"
                    max={selectedItemDetails?.quantityIssued || 0}
                    className="custom-border"
                    style={{ borderColor: "black" }}
                  />
                </Form.Group>
              </Row> */}
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
                  {/* <Form.Group controlId="project">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="project"
                      required
                      value={selectedProject?.value || ""}
                      onChange={(e) => {
                        const newValue = {
                          value: e.target.value,
                          label: e.target.options[e.target.selectedIndex].text,
                        };

                        handleProjectChange(newValue);

                        // ✅ Clear error if user selects a valid project
                        if (errorMessages.project && newValue.value) {
                          setErrorMessages((prev) => ({
                            ...prev,
                            project: "",
                          }));
                        }
                      }}
                      style={{
                        border: `1px solid ${
                          errorMessages.project ? "red" : "black"
                        }`,
                      }}
                    >
                      <option value="">Select Project</option>
                      {projects.map((proj) => (
                        <option key={proj.value} value={proj.value}>
                          {proj.label}
                        </option>
                      ))}
                    </Form.Control>
                    {errorMessages.project && (
                      <small style={{ color: "red" }}>
                        {errorMessages.project}
                      </small>
                    )}
                  </Form.Group> */}
                </Col>
                <Col>
                  <Form.Group controlId="projectCode">
                    <Form.Label>Project Code</Form.Label>
                    <Select
                      value={selectedCodes}
                      placeholder="Select Project Code"
                      onChange={handleProjectCodeChange}
                      options={projects.map((proj) => ({
                        value: proj.code,
                        label: proj.code,
                      }))}
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
                  <Form.Group controlId="researcherName">
                    <Form.Label>Issued to</Form.Label>
                    <Select
                      options={resNames}
                      value={selectedNames}
                      onChange={(selectedOption) => {
                        setSelectedNames(selectedOption);

                        // ✅ Clear error if user selects a valid option
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
                            : "black", // Highlight red if error
                        }),
                      }}
                    />
                  </Form.Group>
                  {errorMessages.researcherName && (
                    <small style={{ color: "red" }}>
                      {errorMessages.researcherName}
                    </small> // Show error message below the field
                  )}
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
                      min={new Date().toISOString().split("T")[0]} // ✅ Set today's date as minimum
                      onChange={(e) => {
                        setExpiryDate(e.target.value);

                        // ✅ Clear error message on valid input
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
                  </Form.Group>
                  {errorMessages.expiryDate && (
                    <small style={{ color: "red" }}>
                      {errorMessages.expiryDate}
                    </small>
                  )}
                </Col>

                <Col>
                  {" "}
                  <Form.Group controlId="quantityIssued">
                    <Form.Label>Quantity Issued</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantityIssued"
                      value={quantityIssued}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          ? parseInt(e.target.value, 10)
                          : "";
                        const maxQuantity =
                          selectedItemDetails?.quantityIssued || 0;

                        if (enteredValue > maxQuantity) {
                          setQuantityIssued(maxQuantity);
                        } else if (enteredValue < 0) {
                          setQuantityIssued(0);
                        } else {
                          setQuantityIssued(enteredValue);
                        }
                        if (
                          errorMessages.quantityIssued &&
                          enteredValue !== ""
                        ) {
                          setErrorMessages((prev) => ({
                            ...prev,
                            quantityIssued: "",
                          }));
                        }
                      }}
                      min="0"
                      max={selectedItemDetails?.quantityIssued || 0}
                      className="custom-border"
                      style={{ borderColor: "black" }}
                    />
                    {errorMessages.quantityIssued && (
                      <small style={{ color: "red" }}>
                        {errorMessages.quantityIssued}
                      </small>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="issuedTo">
                    <Form.Label>Instruction and Specification</Form.Label>
                    <Form.Control
                      type="text"
                      name="issuedTo"
                      required
                      placeholder=""
                      className="custom-border"
                    />
                  </Form.Group>
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
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <TempIssueTable tempItems={tempItems} />
      </div>
    </div>
  );
};

export default IssuedProduct;
