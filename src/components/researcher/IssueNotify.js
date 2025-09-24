import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import {
  getItemIssueApi,
  // getTempIssueApi,
  updateItemStatus,
  revertStock,
} from "../../services/AppinfoService";
import "../../App.css";
import ResearcherNavigation from "./ResearcherNavigation";
const IssueNotify = ({
  masterType,
  onDeclineNotification,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [issued, setIssued] = useState([]);
  const [processedItems, setProcessedItems] = useState(new Set());

  // useEffect(() => {
  //   let mounted = true;
  //   getItemIssueApi()
  //     .then((data) => {
  //       if (mounted) {
  //         setIssued(data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  //   return () => (mounted = false);
  // }, []);

  // Handle the tick button click
  useEffect(() => {
    fetchPendingIssues();
  }, []);

  const fetchPendingIssues = () => {
    getItemIssueApi()
      .then((data) => {
        // Filter only pending issues
        const pendingIssues = data.filter((item) => item.status === "Pending");
        setIssued(pendingIssues);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // useEffect(() => {
  //   let mounted = true;
  //   getItemIssueApi()
  //     .then((data) => {
  //       if (mounted) {
  //         // Filter out already processed (accepted/declined) items
  //         const pendingIssues = data.filter(
  //           (item) => !processedItems.has(item.entry_no)
  //         );
  //         setIssued(pendingIssues);
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));

  //   return () => (mounted = false);
  // }, []);

  const handleActionClick = (entry_no, status) => {
    updateItemStatus(entry_no, status)
      .then(() => {
        // Remove from UI
        setIssued((prevIssued) =>
          prevIssued.filter((item) => item.entry_no !== entry_no)
        );
        alert(`Item with Entry No: ${entry_no} has been ${status}!`);
      })
      .catch((error) => {
        console.error(`Error updating item ${entry_no}:`, error);
        alert(`Failed to update item ${entry_no}. Please try again.`);
      });
  };

  // const handleActionClick = (entry_no, status) => {
  //   console.log("Sending data to updateItemStatus:", { entry_no, status });

  //   updateItemStatus(entry_no, status)
  //     .then(() => {
  //       console.log("Updating status successful. Calling revertStock...");

  //       return revertStock(entry_no);
  //     })
  //     .then(() => {
  //       setIssued((prevIssued) =>
  //         prevIssued.filter((item) => item.entry_no !== entry_no)
  //       );
  //       alert(`Item with Entry No: ${entry_no} has been ${status}!`);
  //     })
  //     .catch((error) => {
  //       console.error(`Error updating item ${entry_no}:`, error);
  //       alert(`Failed to update item ${entry_no}. Please try again.`);
  //     });
  // };

  // // Example API function for reverting stock
  // // const revertStock = async (entryNo) => {
  // //   try {
  // //     const response = await axios.post("/api/revert-stock/", {
  // //       entry_no: entryNo,
  // //     });
  // //     console.log("Revert Stock Response:", response.data);
  // //   } catch (error) {
  // //     console.error(
  // //       "Error reverting stock:",
  // //       error.response?.data || error.message
  // //     );
  // //   }
  // // };

  // const handleRevert = (entry_no) => {
  //   revertStock(entry_no);
  //   setIssued((prevIssued) =>
  //     prevIssued.filter((item) => item.entry_no !== entry_no)
  //   );
  // };

  const handleRevert = async (entry_no, item_code, quantity_issued) => {
    try {
      setIssued((prevIssued) =>
        prevIssued.filter((item) => item.entry_no !== entry_no)
      );
      const response = await axios.post(
        "http://127.0.0.1:8000/decline-issued-item/",
        {
          entry_no,
          item_code,
          quantity_issued,
        }
      );

      alert(response.data.message);
      if (onDeclineNotification) {
        onDeclineNotification(`Item ${item_code} has been Accepted.`);
      }
    } catch (error) {
      alert(
        "Error Accepting issue: " +
          (error.response?.data?.error || "Unknown error")
      );
    }
  };

  return (
    <div>
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{ textAlign: "center", paddingTop: "15px", marginLeft: "30%" }}
        >
          ISSUE NOTIFICATION
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
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Entry No
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
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "350px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  IssueDate
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
                  Quantity Issued
                </th>
                {/* <th style={{ backgroundColor: '#C5EA31', width: '250px', color: 'black', textAlign: 'center', border: '1px solid black' }}>Issued To</th> */}
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
                  Issued To
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
              {issued.map((inven) => (
                <tr key={inven.id}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.entry_no}
                  </td>
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
                  <td
                    style={{
                      textAlign: "center",
                      width: "350px",
                      border: "1px solid black",
                    }}
                  >
                    {inven.issue_date}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.quantity_issued}
                  </td>
                  {/* <td style={{ textAlign: 'center', border: '1px solid black' }}>{inven.issued_to}</td> */}
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.project_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.project_name}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.researcher_name}
                  </td>
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
                        handleActionClick(inven.entry_no, "Accepted")
                      }
                      style={{
                        color: "black",
                        border: "none",
                        marginRight: "5px",
                        background: "none",
                        padding: "5px 18px",
                      }}
                    >
                      ✔
                    </Button>{" "}
                    <button
                      onClick={() =>
                        handleRevert(
                          inven.entry_no,
                          inven.item_code,
                          inven.quantity_issued
                        )
                      }
                      style={{
                        color: "black",
                        border: "none",
                        background: "none",
                        marginRight: "5px",
                        padding: "5px 18px",
                      }}
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

export default IssueNotify;
