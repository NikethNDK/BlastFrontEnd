import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getInventoryApi } from "../../services/AppinfoService";
import "../../App.css";

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    let mounted = true;
    getInventoryApi()
      .then((data) => {
        if (mounted) {
          setInventory(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  return (
    <div className="container-fluid side-container">
      <div className="header-container">
        <h2 style={{ textAlign: "center" }} className="appinfo-header">
          Dashboard
        </h2>
      </div>
      <div className="row side-row">
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
              <th>Entry No</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Tran Type I/R</th>
              <th>Quantity</th>
              <th>Ref Number</th>
              <th>Ref Type</th>
              <th>Batch Number</th>
              <th>Remarks</th>
              <th>Created On</th>
              <th>Created By</th>
              <th>Modified On</th>
              <th>Modified By</th>
              <th>Quantity Issued</th>
              <th>Quantity Received</th>
              <th>Stock</th>
              <th>Dev Remarks</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((inven) => (
              <tr key={inven.id}>
                <td>{inven.entry_no}</td>
                <td>{inven.item_code}</td>
                <td>{inven.item_name}</td>
                <td>{inven.tran_type_IR}</td>
                <td>{inven.qnty}</td>
                <td>{inven.ref_number}</td>
                <td>{inven.ref_type}</td>
                <td>{inven.batch_number}</td>
                <td>{inven.remarks}</td>
                <td>{inven.created_on}</td>
                <td>{inven.created_by}</td>
                <td>{inven.modified_on}</td>
                <td>{inven.modified_by}</td>
                <td>{inven.quantity_issued || ""}</td>
                <td>{inven.quantity_recieved || ""}</td>
                <td>{inven.stock || ""}</td>
                <td>{inven.dev_remarks}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryManager;
