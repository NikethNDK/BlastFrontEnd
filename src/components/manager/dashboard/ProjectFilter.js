import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getProjectApi } from "../../../services/AppinfoService";

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjectApi()
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <div style={{ overflowY: "auto", maxHeight: "350px", width: "fit-content", padding: "5px" }}>
        <Table
          striped
          bordered
          hover
          style={{
            minWidth: "500px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            backgroundColor: "#f7f9fc",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#f7f9fc", color:"#6c757d" }}>Project Code</th>
              <th style={{ textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#f7f9fc", color:"#6c757d" }}>Project Name</th>
              <th style={{ textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#f7f9fc", color:"#6c757d" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    color: "#6c757d",
                    padding: "20px 0",
                  }}
                >
                  Currently no projects
                </td>
              </tr>
            ) : (
              projects.map((proj) => (
                <tr key={proj.project_code}>
                  <td style={{ textAlign: "center", border: "1px solid #dee2e6" }}>
                    {proj.project_code}
                  </td>
                  <td style={{ textAlign: "center", border: "1px solid #dee2e6" }}>
                    {proj.project_name || ""}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                      color: proj.deleted === 0 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {proj.deleted === 0 ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectManage;
