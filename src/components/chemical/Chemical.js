import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getMasterApi } from "../../services/AppinfoService";
import "../../App.css";
import { NavLink } from "react-router-dom";

const MasterComponent = () => {
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
    <div className="container-fluid side-container">
      <div className="header-container">
        <h2 style={{ textAlign: "center" }} className="appinfo-header">
          Dashboard
        </h2>
      </div>
      <div className="row side-row">
        <NavLink
          exact
          to="/lab_assistant/chemical_manage"
          activeClassName="activeClicked"
          className="manage-button"
        >
          <Button variant="primary" size="sm">
            Manage
          </Button>
        </NavLink>
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
              <th>Id</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Master Type</th>
              <th>Quantity</th>
              <th>Units</th>
              <th>Price</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {masters.map((master) => (
              <tr key={master.c_id}>
                <td>{master.c_id}</td>
                <td>{master.item_code}</td>
                <td>{master.item_name}</td>
                <td>{master.m_date}</td>
                <td>{master.supplier}</td>
                <td>{master.master_type}</td>
                <td>{master.quantity}</td>
                <td>{master.units}</td>
                <td>{master.price}</td>
                <td>{master.remarks}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MasterComponent;
