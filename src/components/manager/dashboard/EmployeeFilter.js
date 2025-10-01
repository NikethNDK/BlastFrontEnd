import React, { useEffect, useState } from "react";
import { getEmployeeApi } from "../../../services/AppinfoService";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";

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

  const columns = [
    {
      dataField: "emp_id",
      text: "Employee Id",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#f8fafc",
        fontWeight: 600,
        color: "#1e293b",
        textAlign: "center",
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
      },
      style: { 
        textAlign: "center", 
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
        color: "#475569",
      },
    },
    {
      dataField: "emp_name",
      text: "Employee Name",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#f8fafc",
        fontWeight: 600,
        color: "#1e293b",
        textAlign: "center",
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
      },
      style: { 
        textAlign: "center", 
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
        color: "#475569",
      },
    },
    {
      dataField: "designation",
      text: "Designation",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#f8fafc",
        fontWeight: 600,
        color: "#1e293b",
        textAlign: "center",
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
      },
      style: { 
        textAlign: "center", 
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
        color: "#475569",
      },
    },
    {
      dataField: "project_code",
      text: "Project Code",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#f8fafc",
        fontWeight: 600,
        color: "#1e293b",
        textAlign: "center",
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
      },
      style: { 
        textAlign: "center", 
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
        color: "#475569",
      },
    },
    {
      dataField: "project_name",
      text: "Project Name",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#f8fafc",
        fontWeight: 600,
        color: "#1e293b",
        textAlign: "center",
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
      },
      style: { 
        textAlign: "center", 
        border: "1px solid #e2e8f0",
        padding: "12px",
        fontSize: "0.875rem",
        color: "#475569",
      },
    },
  ];

  return (
    <div style={{ marginTop: "1px", width: "100%" }}>
      <div style={{ paddingTop: "10px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <BootstrapTable
            keyField={(row, index) => `${row.c_id || row.emp_id}-${index}`}
            data={employee}
            columns={columns}
            filter={filterFactory()}
            striped
            hover
            bordered={false}
            className="react-bootstrap-table"
            style={{
              margin: "0",
              width: "100%",
            }}
            rowStyle={{
              borderBottom: "1px solid #e2e8f0",
            }}
            headerClasses="table-header"
          />
        </div>
      </div>

      <style jsx>{`
        :global(.react-bootstrap-table) {
          border-collapse: separate;
          border-spacing: 0;
        }
        
        :global(.react-bootstrap-table table) {
          margin-bottom: 0 !important;
        }

        :global(.react-bootstrap-table td),
        :global(.react-bootstrap-table th) {
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        :global(.react-bootstrap-table tbody tr:hover) {
          background-color: #f1f5f9 !important;
        }

        :global(.react-bootstrap-table .filter) {
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 0.875rem;
          margin-top: 4px;
        }

        :global(.react-bootstrap-table .filter:focus) {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        :global(.table-header) {
          position: sticky;
          top: 0;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default EmployeeFilter;