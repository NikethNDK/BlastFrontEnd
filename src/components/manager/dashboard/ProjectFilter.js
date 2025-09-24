import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getProjectApi } from "../../../services/AppinfoService";

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjectApi()
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      {/* <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2 style={{ textAlign: "center", paddingTop: "15px" }}>
          PROJECT MASTER
        </h2>
      </div> */}
      <p></p>
      <div style={{ overflowY: "scroll", maxHeight: "327px" }}>
        <Table
          striped
          bordered
          hover
          className="project-table"
          id="dataTable"
          style={{ margin: "auto", width: "500px" }}
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
                Project Name
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
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj.project_code}>
                <td style={{ textAlign: "center", border: "1px solid black" }}>
                  {proj.project_code}
                </td>
                <td style={{ textAlign: "center", border: "1px solid black" }}>
                  {proj.project_name || ""}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid black",
                    color: proj.deleted === 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {proj.deleted === 0 ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectManage;
