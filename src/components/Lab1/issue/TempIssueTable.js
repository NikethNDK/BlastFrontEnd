import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Select from "react-select";
import {
  getTempIssueApi,
  updateTempIssueApi,
  deleteTempIssueApi,
  getManufacturersApi,
  getSuppliersApi,
  getProjectApi,
  getMasterApi,
  getResEmployeeApi,
} from "../../../services/AppinfoService";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../../App.css";

const TempIssueTable = () => {
  const [issued, setIssued] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectCodes, setProjectCodes] = useState([]);
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [resNames, setResNames] = useState([]);
  const [issuedToList, setIssuedToList] = useState([]);
  const [issuedTo, setIssuedTo] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [issuedData, manData, supData, projData, masterData, resData] =
          await Promise.all([
            getTempIssueApi(),
            getManufacturersApi(),
            getSuppliersApi(),
            getProjectApi(),
            getMasterApi(),
            getResEmployeeApi(),
          ]);

        if (isMounted) {
          setIssued(issuedData);
          setManufacturers(manData.map((item) => item.manufacturer));
          setSuppliers(supData.map((item) => item.supplier));
          setProjectNames(projData.map((item) => item.project_name));
          setProjectCodes(projData.map((item) => item.project_code));
          setItemsCodes(masterData.map((item) => item.item_code));
          setItemsNames(masterData.map((item) => item.item_name));
          setIssuedTo(masterData.map((item) => item.issued_to));

          const formattedResNames = resData.map((item) => ({
            value: item,
            label: item,
          }));
          setResNames(formattedResNames);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return () => (isMounted = false);
  }, []);
  const handleEdit = (issue) => {
    console.log("Editing issue:", issue);
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const handleDelete = async (entry_no) => {
    try {
      console.log("Deleting issue with entry_no:", entry_no);
      await deleteTempIssueApi(entry_no);
      setIssued(issued.filter((item) => item.entry_no !== entry_no));
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedIssue || !selectedIssue.entry_no) return;

    try {
      console.log("Saving updated issue:", selectedIssue);

      await updateTempIssueApi(selectedIssue.entry_no, selectedIssue);
      setIssued(
        issued.map((item) =>
          item.entry_no === selectedIssue.entry_no ? selectedIssue : item
        )
      );
      alert("Issue data updated succesfully !!");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating issue:", error);
      alert("Failed to update the issue. Please try again.");
    }
  };

  return (
    <div>
      <div style={{ overflowY: "scroll", maxHeight: "280px", padding: "30px" }}>
        <Table striped bordered hover className="react-bootstrap-table">
          <thead>
            <tr style={{ backgroundColor: "#C5EA31", color: "black" }}>
              <th style={headerStyle}>Issued ID</th>
              <th style={headerStyle}>Item Code</th>
              <th style={headerStyle}>Item Name</th>
              <th style={headerStyle}>Quantity Issued</th>
              <th style={headerStyle}>Project Code</th>
              <th style={headerStyle}>Project Name</th>
              <th style={headerStyle}>Issued To</th>
              <th style={headerStyle}>Instruction and Specification</th>
              <th style={headerStyle}>Remarks</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issued.map((inven) => (
              <tr key={inven.entry_no}>
                <td>{inven.entry_no}</td>
                <td>{inven.item_code}</td>
                <td>{inven.item_name}</td>
                <td>{inven.quantity_issued}</td>
                <td>{inven.project_code}</td>
                <td>{inven.project_name}</td>
                <td>{inven.issued_to}</td>
                <td>{inven.instruction_specification}</td>
                <td>{inven.remarks}</td>
                <td>
                  <Button variant="" onClick={() => handleEdit(inven)}>
                    <FaEdit />
                  </Button>{" "}
                  <Button
                    variant=""
                    onClick={() => handleDelete(inven.entry_no)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIssue && (
            <Form>
              {["project_name", "project_code", "item_name", "item_code"].map(
                (key) => (
                  <Form.Group key={key}>
                    <Form.Label>{key.replace(/_/g, " ")}</Form.Label>
                    <Form.Select
                      value={selectedIssue[key]}
                      onChange={(e) =>
                        setSelectedIssue({
                          ...selectedIssue,
                          [key]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select {key.replace(/_/g, " ")}</option>
                      {(key === "project_name"
                        ? projectNames
                        : key === "project_code"
                        ? projectCodes
                        : key === "item_name"
                        ? itemsNames
                        : itemsCodes
                      ).map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )
              )}

              <Form.Group>
                <Form.Label>Researcher Name</Form.Label>
                <Select
                  options={resNames}
                  value={resNames.find(
                    (r) => r.value === selectedIssue.researcher_name
                  )}
                  onChange={(selectedOption) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      researcher_name: selectedOption.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Issued To</Form.Label>
                <Select
                  options={issuedToList}
                  value={issuedToList.find(
                    (r) => r.value === selectedIssue.issued_to
                  )}
                  onChange={(selectedOption) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      issued_to: selectedOption.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Instruction and Specification</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIssue.instruction_specification || ""}
                  onChange={(e) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      instruction_specification: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Quantity Issued</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedIssue.quantity_issued || ""}
                  onChange={(e) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      quantity_issued: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const headerStyle = {
  backgroundColor: "#C5EA31",
  color: "black",
  textAlign: "center",
};
const cellStyle = { textAlign: "center" };

export default TempIssueTable;
