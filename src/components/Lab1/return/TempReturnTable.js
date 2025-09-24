import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getTempReturnApi } from "../../../services/AppinfoService";
import "../../../App.css";
import { NavLink } from "react-router-dom";

const TempReturnTable = () => {
  const [issued, setIssued] = useState([]);

  useEffect(() => {
    let mounted = true;
    getTempReturnApi()
      .then((data) => {
        if (mounted) {
          setIssued(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

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
