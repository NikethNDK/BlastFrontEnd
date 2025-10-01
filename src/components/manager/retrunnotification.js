import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";
import { AiOutlineDownload } from "react-icons/ai";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getItemReturnsForManager } from "../../services/AppinfoService";
import ManagerNavigation from "../manager/ManagerNavigation";

const ReturnDataTableNotification = ({
  managerId,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!managerId) {
        console.log("Manager ID not available yet");
        return;
      }

      try {
        console.log("Fetching data for manager ID:", managerId);
        const fetchedData = await getItemReturnsForManager(managerId);
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch item return data:", error);
      }
    };

    fetchData();
  }, [managerId]);

  const fetchData = async (managerId) => {
    try {
      console.log("Fetching data for manager ID:", managerId);
      const data = await getItemReturnsForManager(managerId);
      console.log("Fetched data:", data);

      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
      }

      setData(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusUpdate = async (entryNo, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/item_return/approve/${entryNo}/`,
        { status }
      );

      console.log(response.data);
      alert(`Item return ${status} successfully!`);

      if (status === "Declined") {
        setData((prevData) =>
          prevData.filter((item) => item.entry_no !== entryNo)
        );
      } else {
        setData((prevData) =>
          prevData.filter((item) => item.entry_no !== entryNo)
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update item return status.");
    }
  };

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const filteredData = data
    .filter((item) =>
      Object.keys(filters).every((key) => {
        const cellValue = String(item[key] || "").toLowerCase();
        const filterValue = String(filters[key] || "").toLowerCase();
        return filterValue ? cellValue.includes(filterValue) : true;
      })
    )
    .sort((a, b) => a.entry_no - b.entry_no);

  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        "Quantity Received": item.quantity_issued,
        "Issued To": item.researcher_name,
        "Issued Date": item.issue_date,
        "Expiry Date": item.expiry_date,
        "Master Type": item.master_type,
        Manufacturer: item.manufacturer,
        Supplier: item.supplier,
        "Project Name": item.project_name,
        "Project Code": item.project_code,
        Remarks: item.remarks,
      }))
    );

    worksheet["!protect"] = {
      password: "readonly",
      edit: false,
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issue Data");
    XLSX.writeFile(workbook, "IssueData.xlsx");
  };

  const columns = [
    { key: "item_code", label: "Item Code" },
    { key: "item_name", label: "Item Name" },
    { key: "quantity_returned", label: "Quantity Returned" },
    { key: "project_name", label: "Project Name" },
    { key: "location", label: "Location" },
    { key: "receipt_date", label: "Receipt Date" },
    { key: "return_date", label: "Return Date" },
    { key: "remarks", label: "Remarks" },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "20px",
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#1e293b",
          }}
        >
          RETURN NOTIFICATION
        </h2>
      </div>

      <div style={{ padding: "20px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              overflowX: "auto",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: "1000px",
              }}
            >
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "12px",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#1e293b",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        minWidth: "120px",
                      }}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "150px",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((inven, index) => (
                  <tr
                    key={inven.id}
                    style={{
                      transition: "background-color 0.15s",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#ffffff" : "#f8fafc";
                    }}
                  >
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.item_code}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.item_name}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.quantity_returned}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.project_name}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.location}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.receipt_date}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.return_date}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {inven.remarks}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleStatusUpdate(inven.entry_no, "Accepted")
                          }
                          style={{
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#059669";
                            e.target.style.boxShadow =
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#10b981";
                            e.target.style.boxShadow =
                              "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                          }}
                        >
                          <FaCheck size={14} /> Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(inven.entry_no, "Declined")
                          }
                          style={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#dc2626";
                            e.target.style.boxShadow =
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#ef4444";
                            e.target.style.boxShadow =
                              "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                          }}
                        >
                          <FaTimes size={14} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnDataTableNotification;