import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getEmployeeApi } from "../../../services/AppinfoService";
import "../../../App.css";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const EmployeeFilter = () => {
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    let mounted = true;
    getEmployeeApi()
      .then((data) => {
        if (mounted) {
          setEmployee(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  // Define your columns as you did before
  const columns = [
    {
      dataField: "emp_id",
      text: "Employee Id",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "emp_name",
      text: "Employee Name",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "designation",
      text: "Designation",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "project_code",
      text: "Project Code",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "project_name",
      text: "Project Name",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
  ];

  return (
    <div>
      {/* <div style={{ background: "#C5EA31", height: "50px" }} className="header">
        <h2 style={{ textAlign: "center", paddingTop: "5px" }}>Employees</h2>
      </div> */}
      <div
        style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "313px" }}
      >
        <div className="row side-row" style={{ textAlign: "center" }}>
          <BootstrapTable
            keyField={(row, index) => `${row.c_id}-${index}`}
            data={employee}
            columns={columns}
            filter={filterFactory()}
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
            style={{ margin: "auto", width: "1000px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilter;
