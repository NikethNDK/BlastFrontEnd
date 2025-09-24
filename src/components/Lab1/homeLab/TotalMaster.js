import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getLabMasterApi, getMasterApi } from "../../services/AppinfoService";
import "../../App.css";

const TotalMaster = () => {
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    let mounted = true;
    getMasterApi()
      .then((data) => {
        if (mounted) {
          setMasters(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  return (
    <div>
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{
            textAlign: "center",
            paddingTop: "15px",
            marginRight: "8px",
          }}
        >
          Dashboard
        </h2>
      </div>
      <div style={{ overflowY: "scroll", maxHeight: "460px" }}>
        <div className="row side-row" style={{ textAlign: "center" }}>
          <p id="before-table"></p>
          <Table
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
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
                  Master Type
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
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Price
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
                  Instruction/Specification
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
                  Min Req Stock
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
                  Quantity Received
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
                <th
                  style={{
                    backgroundColor: "#C5EA31",
                    width: "250px",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  Stock
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
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {masters.map((master) => (
                <tr key={master.c_id}>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.item_code}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.item_name}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.master_type}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.units}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.price}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.instruction_specification}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.min_req_stock}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.quantity_received}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.quantity_issued}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.quantity}
                  </td>
                  <td
                    style={{ textAlign: "center", border: "1px solid black" }}
                  >
                    {master.remarks}
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

export default TotalMaster;
