import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getProjectApi } from "../../../services/AppinfoService";
import "../../../App.css";
import { NavLink } from "react-router-dom";

const Project = () => {
  const [project, setProject] = useState([]);

  useEffect(() => {
    let mounted = true;
    getProjectApi()
      .then((data) => {
        if (mounted) {
          setProject(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  return (
    <div>
      <div style={{ background: "#C5EA31", height: "50px", padding: "10px" }}>
        {/* <div style={{background: "#C5EA31", height: '70px'}} className="header"> */}
        <h2
          style={{ textAlign: "center", paddingTop: "15px", marginLeft: "40%" }}
        >
          PROJECT MASTER
        </h2>
      </div>
      <div style={{ overflowY: "hidden", maxHeight: "calc(100vh - 100px)" }}>
        <div className="row side-row" style={{ textAlign: "center" }}>
          <p id="before-table"></p>
          <Table
            striped
            bordered
            hover
            className="react-bootstrap-table"
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
              </tr>
            </thead>
            <tbody>
              {project.map((pro) => (
                <tr key={pro.id}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {pro.project_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {pro.project_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Project;
