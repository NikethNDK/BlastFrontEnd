import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
// import "./TransferredDataTable.css";
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
    .sort((a, b) => a.entry_no - b.entry_no); // Sort in ascending order ;

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

  return (
    <div className="table-container">
      <h2>Return Data</h2>
      <div className="total-summary">
        {/* <p>
          <strong>Total Quantity Returned: </strong> {totalQuantityReceived}
        </p> */}
      </div>
      <button
        style={{
          marginLeft: "95%",
          width: "3%",
          height: "20%",
          border: "none",
          backgroundColor: "#198754",
          color: "White",
          borderRadius: "5px",
          marginTop: "-1px",
        }}
        variant="success"
        onClick={handleDownload}
      >
        <AiOutlineDownload size={20} />
      </button>
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
              {[
                "Entry No",
                "Item Name",
                "Item Code",
                "Quantity Returned",
                "Batch Number",
                "Receipt Date",
                "Expiry Date",
                "Manufacturer",
                "Supplier",
                "Project Name",
                "Invoice No",

                "Return Date",
                "Remarks",
              ].map((heading, index) => (
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    border: "1px solid black",
                    backgroundColor: "rgb(197, 234, 49)",
                    color: "black",
                  }}
                  key={index}
                >
                  {heading}
                  <br />
                  <input
                    style={{ border: "1px solid black" }}
                    type="text"
                    placeholder="Filter"
                    onChange={(e) =>
                      handleFilterChange(
                        e,
                        heading.toLowerCase().replace(/\s/g, "_")
                      )
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} className={index < 10 ? "highlight-row" : ""}>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.entry_no}
                </td>

                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.item_name}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.item_code}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.quantity_returned}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.batch_number}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.receipt_date}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.expiry_date}
                </td>

                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.manufacturer}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.supplier}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.project_name}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.invoice_no}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.return_date}
                </td>
                <td style={{ padding: "10px", border: "1px solid black" }}>
                  {item.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnDataTable;
