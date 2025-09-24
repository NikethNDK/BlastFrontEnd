import React,{ useEffect, useState }from 'react';
import {Table} from 'react-bootstrap';

import {Button,ButtonToolbar } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
import AddAppinfoModal from "./AddAppinfoModal";
import UpdateAppinfoModal from "./UpdateAppinfoModal";
import { getAppinfo, deleteAppinfo } from '../../services/AppinfoService';



const Manage = () => {
    const [appinfos, setAppinfos] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editAppinfos, setEditAppinfos] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
      let mounted = true;
    
      console.log('Effect triggered. Checking conditions...');
    
      if (appinfos.length && !isUpdated) {
        console.log('Data already present and not updated. Returning early.');
        return;
      }
    
      console.log('Fetching new data...');
    
      getAppinfo()
        .then(data => {
          if (mounted) {
            console.log('Data received:', data);
            setAppinfos(data);
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
    }, [isUpdated, appinfos]);
    
    const handleUpdate = async (e, stu) => {
      e.preventDefault();
        setEditModalShow(true);
        setEditAppinfos(stu);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        setAddModalShow(true);
    };

    const handleDelete = (e, infocode) => {
      if (window.confirm('Are you sure?')) {
          e.preventDefault();
          deleteAppinfo(infocode)
              .then((result) => {
                  alert("Deleted Successfully"); // Display a success message
                  setIsUpdated(true); // Update state or trigger a re-fetch of data
              })
              .catch((error) => {
                  console.error('Failed to delete appinfo:', error);
                  alert('Failed to delete appinfo. Please check the console for details.');
              });
      }
  };

    let AddModelClose=()=>setAddModalShow(false);
    let EditModelClose=()=>setEditModalShow(false);
    return(
        <div className="container-fluid side-container">
        <div className="header-container">
          <h2 style={{ textAlign: 'center' }} className="appinfo-header">Appinfo</h2>
        </div>
        <div className="row side-row" >
        <p id="manage"></p>
            <Table striped bordered hover className="react-bootstrap-table" id="dataTable">
                <thead>
                <tr>
                  <th>Info Code</th>
                  <th>Info Value</th>
                  <th>Remarks</th>
                  <th>Created On</th>
                  <th>Created By</th>
                  <th>Modified On</th>
                  <th>Modified By</th>
                  <th>MDev Remarks</th>
                  <th colspan="2" style={{ textAlign: 'center' }}>Action</th>
                </tr>
                </thead>
                <tbody>
                {appinfos.map((ainfo) => (
                  <tr key={ainfo.infocode}>
                      <td>{ainfo.infocode}</td>
                      <td>{ainfo.infovalue || ''}</td>
                      <td>{ainfo.remarks || ''}</td>
                      <td>{ainfo.created_on || ''}</td>
                      <td>{ainfo.created_by || ''}</td>
                      <td>{ainfo.modified_on || ''}</td>
                      <td>{ainfo.modified_by || ''}</td>
                      <td>{ainfo.dev_remarks || ''}</td>
                      <td>
                          <Button className="mr-2" variant="danger" onClick={(event) => handleDelete(event, ainfo.infocode)}>
                              <RiDeleteBin5Line />
                          </Button>
                      </td>
                      <td>
                          <Button className="mr-2" onClick={(event) => handleUpdate(event, ainfo)}>
                              <FaEdit />
                          </Button>
                          <UpdateAppinfoModal show={editModalShow} appinfo={editAppinfos} setUpdated={setIsUpdated} onHide={EditModelClose} />

                      </td>
                  </tr>))}

              </tbody>
            </Table>
            <ButtonToolbar>
                <Button variant="primary" onClick={handleAdd}>
                Add Appinfo
                </Button>
                <AddAppinfoModal show={addModalShow} setUpdated={setIsUpdated}
                onHide={AddModelClose}></AddAppinfoModal>
            </ButtonToolbar>
        </div>
        </div>
    );
};

export default Manage;