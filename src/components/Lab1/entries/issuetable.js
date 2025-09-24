import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./TransferredDataTable.css";
import { AiOutlineDownload } from "react-icons/ai";
import LabNavigation1 from "../homeLab/LabNavigation1";
const IssueDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/issue_data/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDateChange = (e, type) => {
    if (type === "from") setFromDate(e.target.value);
    else setToDate(e.target.value);
  };

  const filteredData = data.filter((item) => {
    return (
      Object.keys(filters).every((key) => {
        const cellValue = String(item[key] || "").toLowerCase();
        const filterValue = String(filters[key] || "").toLowerCase();
        return filterValue ? cellValue.includes(filterValue) : true;
      }) &&
      (!fromDate || new Date(item.issue_date) >= new Date(fromDate)) &&
      (!toDate || new Date(item.issue_date) <= new Date(toDate))
    );
  });
  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };
  // const handleFilterChange = (e, key) => {
  //   setFilters({ ...filters, [key]: e.target.value });
  // };

  // const filteredData = data.filter((item) =>
  //   Object.keys(filters).every((key) => {
  //     const cellValue = String(item[key] || "").toLowerCase();
  //     const filterValue = String(filters[key] || "").toLowerCase();
  //     return filterValue ? cellValue.includes(filterValue) : true;
  //   })
  // );

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
    // Protecting the sheet from edits
    worksheet["!protect"] = {
      password: "readonly",
      edit: false, // Disable editing
      selectLockedCells: true, // Allow selection of locked cells
      selectUnlockedCells: false, // Prevent editing
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issue Data");
    XLSX.writeFile(workbook, "IssueData.xlsx");
  };
  // ✅ Calculate totals
  const totalQuantityReceived = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_issued) || 0),
    0
  );
  const tableHeadings = [
    { label: "Entry No", key: "entry_no" },
    { label: "Item Name", key: "item_name" },
    { label: "Item Code", key: "item_code" },
    { label: "Quantity Issued", key: "quantity_issued" },
    { label: "Issued To", key: "researcher_name" }, // fix here 💡
    { label: "Issued Date", key: "issue_date" },
    { label: "Master Type", key: "master_type" },
    { label: "Project Name", key: "project_name" },
    { label: "Project Code", key: "project_code" },
    { label: "Remarks", key: "remarks" },
  ];

  return (
    <div>
      <div className="table-container">
        <h2>Issued Data</h2>
        <div className="total-summary">
          <p>
            <strong>Total Quantity Issued</strong> {totalQuantityReceived}
          </p>
        </div>
        <div
          style={{
            marginTop: "-50px",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              marginLeft: "95%",
              width: "3%",
              height: "20%",
              border: "none",
              backgroundColor: "#198754",
              color: "White",
              borderRadius: "5px",
              marginTop: "1px",
            }}
            variant="success"
            onClick={handleDownload}
          >
            <AiOutlineDownload size={20} />
          </button>
        </div>
        <p></p>

   
        <div
          style={{
            maxWidth: "100%",
            overflowX: "auto",
            borderRadius: "1px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          className="table-wrapper"
        >
          <table
            style={{
              width: "100%",
              borderRadius: "2px",
              borderCollapse: "collapse",
              backgroundColor: "white",
            }}
            className="styled-table"
          >
            <thead>
              <tr>
                {tableHeadings.map(({ label, key }, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid black",
                      backgroundColor: "rgb(197, 234, 49)",
                      color: "black",
                    }}
                  >
                    {label}

                    {key === "issue_date" ? (
                      <>
                        <br />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <label
                              style={{ fontWeight: "bold", width: "40px" }}
                            >
                              From:
                            </label>
                            <input
                              type="date"
                              value={fromDate}
                              onChange={(e) => handleDateChange(e, "from")}
                              style={{
                                flex: 1,
                                padding: "2px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <label
                              style={{ fontWeight: "bold", width: "40px" }}
                            >
                              To:
                            </label>
                            <input
                              type="date"
                              value={toDate}
                              onChange={(e) => handleDateChange(e, "to")}
                              style={{
                                flex: 1,
                                padding: "2px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <br />
                        <input
                          type="text"
                          placeholder="Filter"
                          value={filters[key] || ""}
                          onChange={(e) => handleFilterChange(e, key)}
                        />
                      </>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} className={index < 10 ? "highlight-row" : ""}>
                  {tableHeadings.map(({ key }, i) => (
                    <td
                      key={i}
                      style={{ padding: "10px", border: "1px solid black" }}
                    >
                      {item[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IssueDataTable;
