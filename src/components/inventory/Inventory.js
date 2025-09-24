import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { getInventoryApi } from '../../services/AppinfoService';
import "../../App.css";
import { NavLink } from 'react-router-dom';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    let mounted = true;
    getInventoryApi()
      .then(data => {
        if (mounted) {
          setInventory(data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  
    return () => (mounted = false);
  }, []);

  return(
    <div className="container-fluid side-container">
    <div className="header-container">
      <h2 style={{ textAlign: 'center' }} className="appinfo-header">INVENTORY TRANSACTION</h2>
    </div>
      <div className="row side-row">
        <NavLink exact to="/lab_assistant/inventory_manage" activeClassName="activeClicked" className="manage-button">
          <Button variant="primary" size="sm">
            Manage
          </Button>
        </NavLink>
    <p id="before-table"></p>
        <Table striped bordered hover className="react-bootstrap-table" id="dataTable">
        <thead>
            <tr>
            <th>Entry No</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Tran Type I/R</th>
            <th>Date</th>
            <th>Supplier</th>
            <th>Units</th>
            <th>Price</th>
            <th>Quantity Issued</th>
            <th>Quantity Received</th>
            <th>Quantity</th>
            <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            {inventory.map((inven) =>
            <tr key={inven.id}>
                <td>{inven.entry_no}</td>
                <td>{inven.item_code}</td>
                <td>{inven.item_name}</td>
                <td>{inven.tran_type_IR}</td>
                <td>{inven.i_date}</td>
                <td>{inven.supplier}</td>
                <td>{inven.units}</td>
                <td>{inven.price}</td>
                <td>{inven.quantity_issued}</td>
                <td>{inven.quantity_received}</td>
                <td>{inven.quantity}</td>
                <td>{inven.remarks}</td>
            </tr>)}
        </tbody>
    </Table>
    </div>
  </div>
  );
};

export default Inventory;