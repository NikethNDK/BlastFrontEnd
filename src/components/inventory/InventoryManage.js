import React,{ useEffect, useState }from 'react';
import {Table} from 'react-bootstrap';

import {Button,ButtonToolbar } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
import AddInventoryReceiveModal from "./AddInventoryReceiveModal";
import UpdateInventoryModal from "./UpdateInventoryModal";
import { getInventoryApi, deleteInventoryApi, getRequestApi } from '../../services/AppinfoService';
import { useNavigate } from 'react-router-dom';
import { HiArrowCircleUp } from "react-icons/hi";
import ApprovalInventoryModal from './ApprovalInventoryModal';


const InventoryManage = () => {
    const [inventories, setInventory] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editInventory, setEditInventory] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [approvalModalShow, setApprovalModalShow] = useState(false)
    const [itemCode, setItemCode] = useState('');
    const [itemName, setItemName] = useState('');
  

    const navigate = useNavigate();

    useEffect(() => {
      let mounted = true;
    
      console.log('Effect triggered. Checking conditions...');
    
      if (inventories.length && !isUpdated) {
        console.log('Data already present and not updated. Returning early.');
        return;
      }
    
      console.log('Fetching new data...');
    
      getInventoryApi()
        .then(data => {
          if (mounted) {
            console.log('Inventory Data received:', data);
            setInventory(data);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    
      return () => {
        console.log('Cleanup: Effect will unmount.');
        mounted = false;
        setIsUpdated(false);
      };
    }, [isUpdated, inventories]);
    
    const handleUpdate = (e, stu, item_code, item_name) => {
      e.preventDefault();
    
      // Fetch request data from the API
      getRequestApi()
        .then((response) => {
          console.log('API Response:', response);
    
          // Check if there is at least one request in the array
          if (response.length > 0) {
            let found = false;
    
            for (let i = 0; i < response.length; i++) {
              const request = response[i];
    
              // Check if the current request meets all conditions
              if (
                request.ItemType === 'Inventory' &&
                request.ItemCode === item_code &&
                request.ItemName === item_name &&
                request.RequestStatus === 'Approved'
              ) {
                found = true;
    
                // Perform actions if all conditions are met
                setEditModalShow(true);
                setEditInventory(stu);
              }
            }
    
            if (!found) {
              console.log('No request found with matching conditions.');
              alert('Request is not approved.'); // Alert if conditions are not met
            }
          } else {
            console.log('No requests found in the response.');
            alert('Please send a request.'); // Alert if there are no requests
          }
        })
        .catch((error) => {
          console.error('Error fetching request data:', error);
        });
    };
    
    
    const handleAdd = (e) => {
        e.preventDefault();
        setAddModalShow(true);
    };

    const handleOpenApp = (e, itemCode, itemName) => {
      e.preventDefault();
      setApprovalModalShow(true);
      setItemCode(itemCode); // assuming you have a state variable to store itemCode
      setItemName(itemName); // assuming you have a state variable to store itemName
    };

    const handleDelete = (e, eno) => {
        if(window.confirm('Are you sure ?')){
            e.preventDefault();
            deleteInventoryApi(eno)
            .then((result)=>{
                alert("Deleted Successfully");
                setIsUpdated(true);
            },
            (error)=>{
                alert("Failed to Delete Inventory");
            })
        }
    };

    let AddModelClose=()=>setAddModalShow(false);
    let EditModelClose=()=>setEditModalShow(false);
    let ApprovalModalClose=()=>setApprovalModalShow(false);

    return(
        <div className="container-fluid side-container">
        <div className="header-container">
          <h2 style={{ textAlign: 'center' }} className="appinfo-header">INVENTORY TRANSACTION</h2>
        </div>
        <div className="row side-row" >
        <p id="manage"></p>
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
                  <th colspan="2" style={{ textAlign: 'center' }}>Action</th>
                </tr>
                </thead>
                <tbody>
                {inventories.map((inven) => (
                  <tr key={inven.entry_no}>
                      <td>{inven.entry_no}</td>
                      <td>{inven.item_code || ''}</td>
                      <td>{inven.item_name || ''}</td>
                      <td>{inven.tran_type_IR || ''}</td>
                      <td>{inven.i_date || ''}</td>
                      <td>{inven.supplier || ''}</td>
                      <td>{inven.units || ''}</td>
                      <td>{inven.price || ''}</td>
                      <td>{inven.quantity_issued || ''}</td>
                      <td>{inven.quantity_received || ''}</td>
                      <td>{inven.quantity || ''}</td>
                      <td>{inven.remarks || ''}</td>
                      {/*<td>
                          <Button className="mr-2" variant="danger" onClick={(event) => handleDelete(event, inven.entry_no)}>
                              <RiDeleteBin5Line />
                          </Button>
                </td> */}
                      <td>
                          <Button className="mr-2" onClick={(event) => handleUpdate(event, inven, inven.item_code, inven.item_name)}>
                              <FaEdit style={{ fontSize: '24px' }}  />
                          </Button>
                          <UpdateInventoryModal show={editModalShow} inventory={editInventory} setUpdated={setIsUpdated} onHide={EditModelClose} />

                      </td>
                      <td>
                        <Button className='mr-2' onClick={handleOpenApp} style={{ backgroundColor: 'green', color: 'white' }}>
                          <HiArrowCircleUp style={{ fontSize: '24px' }}  />
                          </Button>
                          <ApprovalInventoryModal
                            show={approvalModalShow}
                            setUpdated={setIsUpdated}
                            onHide={ApprovalModalClose}
                            itemCode={inven.item_code} // pass itemCode as a prop
                            itemName={inven.item_name} // pass itemName as a prop
                          />
                      </td>
                  </tr>))}

              </tbody>
            </Table>
            <ButtonToolbar>
                <Button variant="primary" onClick={handleAdd}>
                Add
                </Button>
                <AddInventoryReceiveModal show={addModalShow} setUpdated={setIsUpdated}
                onHide={AddModelClose}></AddInventoryReceiveModal>
            </ButtonToolbar>
        </div>
        </div>
    );
};

export default InventoryManage;