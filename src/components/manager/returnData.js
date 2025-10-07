import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { AiOutlineDownload } from "react-icons/ai";

const ReturnDataTable = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/item_return/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const totalQuantityReceived = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_issued) || 0),
    0
  );

  const columns = [
    { key: "entry_no", label: "Entry No" },
    { key: "item_name", label: "Item Name" },
    { key: "item_code", label: "Item Code" },
    { key: "quantity_returned", label: "Quantity Returned" },
    { key: "batch_number", label: "Batch Number" },
    { key: "receipt_date", label: "Receipt Date" },
    { key: "expiry_date", label: "Expiry Date" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "supplier", label: "Supplier" },
    { key: "project_name", label: "Project Name" },
    { key: "invoice_no", label: "Invoice No" },
    { key: "return_date", label: "Return Date" },
    { key: "remarks", label: "Remarks" },
  ];

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#1e293b",
          }}
        >
          Return Data
        </h2>
        <button
          onClick={handleDownload}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 16px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "all 0.2s",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#059669";
            e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#10b981";
            e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
          }}
        >
          <AiOutlineDownload size={18} style={{ marginRight: "6px" }} />
          Download
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
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
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>{column.label}</div>
                    <input
                      type="text"
                      placeholder="Filter"
                      onChange={(e) => handleFilterChange(e, column.key)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 2px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#cbd5e1";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    transition: "background-color 0.15s",
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
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.entry_no}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.item_name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.item_code}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.quantity_returned}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.batch_number}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.receipt_date}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.expiry_date}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.manufacturer}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.supplier}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.project_name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.invoice_no}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.return_date}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "#475569",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {item.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReturnDataTable;