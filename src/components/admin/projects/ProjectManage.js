import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { Button, ButtonToolbar } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddProjectModal from "./AddProjectModal";
import UpdateProjectModal from "./UpdateProjectModal";
import {
  getProjectApi,
  inactiveProjectApi,
} from "../../../services/AppinfoService";
import * as XLSX from "xlsx";
import { AiOutlineDownload } from "react-icons/ai";
import "../../styles/styles.css";

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editProjects, setEditProjects] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ code: "", name: "" });

  useEffect(() => {
    let mounted = true;

    console.log("Effect triggered. Checking conditions...");

    if (projects.length && !isUpdated) {
      console.log("Data already present and not updated. Returning early.");
      return;
    }

    console.log("Fetching new data...");

    getProjectApi()
      .then((data) => {
        if (mounted) {
          console.log("Project Data received:", data);
          setProjects(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      console.log("Cleanup: Effect will unmount.");
      mounted = false;
      setIsUpdated(false);
    };
  }, [isUpdated, projects]);

  const handleUpdate = (e, stu) => {
    e.preventDefault();
    setEditModalShow(true);
    setEditProjects(stu);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setAddModalShow(true);
  };

  const handleInactive = (e, project_code) => {
    e.preventDefault();
    inactiveProjectApi(project_code)
      .then((data) => {
        alert("Project Inactivated");
        console.log("Project inactive:", data);

        // Update the projects state to mark the project as inactive
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj.project_code === project_code
              ? { ...proj, deleted: 1 } // Update the 'deleted' flag to 1
              : proj
          )
        );
      })
      .catch((error) => {
        console.error("Failed to inactivate project:", error);
        alert("Failed to Inactivate Project");
      });
  };

  let AddModelClose = () => setAddModalShow(false);
  let EditModelClose = () => setEditModalShow(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newSearchTerm = { ...searchTerm, [name]: value };
    setSearchTerm(newSearchTerm);

    const filtered = projects.filter((item) => {
      return (
        item.project_code
          .toLowerCase()
          .includes(newSearchTerm.code.toLowerCase()) &&
        item.project_name
          .toLowerCase()
          .includes(newSearchTerm.name.toLowerCase())
      );
    });

    setFilteredProjects(filtered);
  };

  const exportToExcel = () => {
    const exportData =
      filteredProjects.length > 0 || searchTerm.code || searchTerm.name
        ? filteredProjects
        : projects;

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "project_data.xlsx");
  };

  return (
    <div>
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{ textAlign: "center", paddingTop: "15px", marginLeft: "40%" }}
        >
          PROJECT MASTER
        </h2>
      </div>
      <div style={{ overflowX: "hidden", maxHeight: "500px" }}>
        <div className="row side-row" style={{ textAlign: "center" }}>
          <div className="d-flex justify-content-center align-items-center gap-3 m-3">
            <ButtonToolbar>
              <Button variant="primary" onClick={handleAdd}>
                Add Project
              </Button>

              <AddProjectModal
                show={addModalShow}
                setUpdated={setIsUpdated}
                onHide={AddModelClose}
                projects={projects || []}
              ></AddProjectModal>
            </ButtonToolbar>
            <p id="manage"></p>
            <div className="m-3">
              <Form>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    name="code"
                    placeholder="Search by Project Code"
                    value={searchTerm.code}
                    onChange={handleFilterChange}
                    style={{ maxWidth: "300px" }}
                  />
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Search by Project Name"
                    value={searchTerm.name}
                    onChange={handleFilterChange}
                    style={{ maxWidth: "300px" }}
                  />
                  <Button variant="success" onClick={exportToExcel}>
                    <AiOutlineDownload size={20} /> {/* Download Icon */}
                  </Button>
                  {/* <Button
                    variant="success"
                   
                    onClick={exportToExcel}
                  >
                    Export to Excel
                  </Button> */}
                </div>
              </Form>
            </div>
          </div>

          <Table
            style={{
              maxHeight: projects.length > 5 ? "300px" : "auto", // Enable scroll if more than 5 rows
              overflowY: projects.length > 5 ? "auto" : "hidden", // Scroll only if more than 5
              border: projects.length > 5 ? "1px solid black" : "none",
              scrollbarWidth: "thin",
              msOverflowStyle: "none",
            }}
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
            // style={{ margin: "auto", overflowY: "hidden", width: "840px" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Project Code
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Projects Name
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {(filteredProjects.length > 0 ||
              searchTerm.code ||
              searchTerm.name
                ? filteredProjects
                : projects
              ).map((proj) => (
                <tr key={proj.project_code}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {proj.project_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {proj.project_name || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    <Button
                      className="mr-2"
                      variant={proj.deleted === 0 ? "primary" : "secondary"}
                      onClick={
                        proj.deleted === 0
                          ? (event) => handleInactive(event, proj.project_code)
                          : undefined
                      }
                      disabled={proj.deleted !== 0}
                      style={{
                        backgroundColor:
                          proj.deleted === 0 ? "#0d6efd" : "gray",
                        borderColor: proj.deleted === 0 ? "#0d6efd" : "gray",
                        cursor: proj.deleted === 0 ? "pointer" : "not-allowed",
                      }}
                    >
                      {proj.deleted === 0 ? "Inactive" : "Inactive"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* <tbody>
              {projects.map((proj) => (
                <tr key={proj.project_code}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {proj.project_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {proj.project_name || ""}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    <Button
                      className="mr-2"
                      variant={proj.deleted === 0 ? "primary" : "secondary"}
                      onClick={
                        proj.deleted === 0
                          ? (event) => handleInactive(event, proj.project_code)
                          : undefined
                      }
                      disabled={proj.deleted !== 0}
                      style={{
                        backgroundColor:
                          proj.deleted === 0 ? "#0d6efd" : "gray",
                        borderColor: proj.deleted === 0 ? "#0d6efd" : "gray",
                        cursor: proj.deleted === 0 ? "pointer" : "not-allowed",
                      }}
                    >
                      {proj.deleted === 0 ? "Inactive" : "Inactive"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProjectManage;
