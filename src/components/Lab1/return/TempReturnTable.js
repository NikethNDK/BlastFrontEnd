import React, { useEffect, useState, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import { getTempReturnApi } from "../../../services/AppinfoService";
import "../../../App.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const TempReturnTable = ({ userDetails = { name: '', lab: '', designation: '' } }) => {
  // Get user from Redux as fallback/primary source
  const reduxUser = useSelector((state) => state.user.user);
  
  // Merge userDetails prop with Redux user data (Redux takes priority)
  const effectiveUserDetails = useMemo(() => {
    return reduxUser ? {
      name: reduxUser.user_name || userDetails.name || "",
      user_name: reduxUser.user_name || userDetails.user_name || userDetails.name || "",
      lab: reduxUser.lab || userDetails.lab || "N/A",
      designation: reduxUser.designation || userDetails.designation || "Not Assigned",
      role: reduxUser.role || userDetails.role || ""
    } : userDetails;
  }, [reduxUser, userDetails]);

  // Extract username and lab for API calls
  const username = useMemo(() => 
    effectiveUserDetails.user_name || effectiveUserDetails.name || null,
    [effectiveUserDetails.user_name, effectiveUserDetails.name]
  );
  const labName = useMemo(() => 
    effectiveUserDetails.lab && effectiveUserDetails.lab !== 'N/A' 
      ? effectiveUserDetails.lab 
      : null,
    [effectiveUserDetails.lab]
  );

  const [issued, setIssued] = useState([]);

  useEffect(() => {
    let mounted = true;
    getTempReturnApi(username, labName)
      .then((data) => {
        if (mounted) {
          setIssued(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, [username, labName]);

  return (
    <div>
      <div style={{ overflowY: "scroll", maxHeight: "210px" }}>
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
                  Issued ID
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
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Units
                </th>
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "350px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  ReturnDate
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
                  Quantity Return
                </th>
              </tr>
            </thead>
            <tbody>
              {issued.map((inven) => (
                <tr key={inven.id}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.bill_no}
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
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.units}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      width: "350px",
                      border: "1px solid black",
                    }}
                  >
                    {inven.receipt_date}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.quantity_return}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {inven.issued_to}
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

export default TempReturnTable;
