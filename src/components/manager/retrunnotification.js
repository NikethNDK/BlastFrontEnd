import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Table, Button } from "react-bootstrap";
import ManagerNavigation from "../manager/ManagerNavigation";
// import "./TransferredDataTable.css";
import { AiOutlineDownload } from "react-icons/ai";
import { getItemReturnsForManager } from "../../services/AppinfoService";

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

      setData(data || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!managerId) {
  //       console.log("Manager ID not available yet");
  //       return;
  //     }

  //     try {
  //       console.log("Fetching data for manager ID:", managerId);
  //       const fetchedData = await getItemReturnsForManager(managerId);
  //       setData(fetchedData);
  //     } catch (error) {
  //       console.error("Failed to fetch item return data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [managerId]); // This will re-run whenever managerId changes

  const handleStatusUpdate = async (entryNo, status) => {
    try {
      // Optimistically update the UI before API call

      // Corrected API call using entryNo
      const response = await axios.put(
        `http://localhost:8000/item_return/approve/${entryNo}/`,
        { status }
      );

      console.log(response.data);
      alert(`Item return ${status} successfully!`);
      // Remove the entry from the table when it's declined
      if (status === "Declined") {
        setData((prevData) =>
          prevData.filter((item) => item.entry_no !== entryNo)
        );
      } else {
        // Remove it for "Accepted" status as well (if needed)
        setData((prevData) =>
          prevData.filter((item) => item.entry_no !== entryNo)
        );
      }
      // UI update already done, no need to setData again
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
  return (
    <div>
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{ textAlign: "center", paddingTop: "15px", marginLeft: "30%" }}
        >
          RETURN NOTIFICATION
        </h2>
      </div>

      
      <div
        style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "500px" }}
      >
        <div className="row side-row" style={{ textAlign: "center" }}>
          <p id="before-table"></p>
          <Table
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
            style={{ margin: "auto", width: "1000px" }}
          >
            <thead>
              <tr>
                {/* <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Entry No
                </th> */}
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Item Code
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
                  Item Name
                </th>
                {/* <th style={{ backgroundColor: '#C5EA31', width: '250px', color: 'black', textAlign: 'center', border: '1px solid black' }}>Units</th> */}
                {/* <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "350px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  IssueDate
                </th> */}
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Quantity Returned
                </th>
                {/* <th style={{ backgroundColor: '#C5EA31', width: '250px', color: 'black', textAlign: 'center', border: '1px solid black' }}>Issued To</th> */}
                {/* <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Project Code
                </th> */}
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
                  Location
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
                  Receipt Date
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
                  Return Date
                </th>
                {/* <th style={{ backgroundColor: '#C5EA31', width: '250px', color: 'black', textAlign: 'center', border: '1px solid black' }}>Batch/Lot Number</th> */}
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Remarks
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
              {data.map((inven) => (
                <tr key={inven.id}>
                  {/* <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.entry_no}
                  </td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.item_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.item_name}
                  </td>
                  {/* <td style={{ textAlign: 'center', border: '1px solid black' }}>{inven.unit_price}</td> */}
                  {/* <td
                    style={{
                      textAlign: "center",
                      width: "350px",
                      border: "1px solid black",
                    }}
                  >
                    {inven.issue_date}
                  </td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.quantity_returned}
                  </td>
                  {/* <td style={{ textAlign: 'center', border: '1px solid black' }}>{inven.issued_to}</td> */}
                  {/* <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.project_code}
                  </td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.project_name}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.location}
                  </td>

                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.receipt_date}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.return_date}
                  </td>
                  {/* <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.researcher_name}
                  </td> */}
                  {/* <td style={{ textAlign: 'center', border: '1px solid black' }}>{inven.batch_number}</td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.remarks}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {/* <Button
                                     variant=""
                                     onClick={() => handleTickClick(inven.id)}
                                     style={{ borderColor: "#28a745" }}
                                   > */}
                    <Button
                      onClick={() =>
                        handleStatusUpdate(inven.entry_no, "Accepted")
                      }
                      style={{ borderColor: "", backgroundColor: "white" }}
                    >
                      ✔️
                    </Button>{" "}
                    <button
                      onClick={() =>
                        handleStatusUpdate(inven.entry_no, "Declined")
                      }
                      style={{ backgroundColor: "white" }}
                    >
                      ❌
                    </button>
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

const borderStyle = {
  border: "1px solid black", // Default black border
};

const headerStyle = {
  backgroundColor: "#C5EA31",
  width: "250px",
  color: "black",
  textAlign: "center",
  border: "2px solid #000", // Thicker black border for headers
};

const cellStyle = {
  textAlign: "center",
  border: "1px solid #28a745", // Green border for cells
};

export default ReturnDataTableNotification;
