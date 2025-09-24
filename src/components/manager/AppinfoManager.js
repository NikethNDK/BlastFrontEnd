import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { getAppinfo } from '../../services/AppinfoService';
import "../../App.css";

const AppinfoManager = () => {
  const [students, setAppinfo] = useState([]);

  useEffect(() => {
    let mounted = true;
    getAppinfo()
      .then(data => {
        if (mounted) {
          setAppinfo(data);
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
      <h2 style={{ textAlign: 'center' }} className="appinfo-header">Appinfo</h2>
    </div>
      <div className="row side-row">
    <p id="before-table"></p>
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
            <th>Dev Remarks</th>
            </tr>
        </thead>
        <tbody>
            {students.map((ainfo) =>
            <tr key={ainfo.id}>
                <td>{ainfo.infocode}</td>
                <td>{ainfo.infovalue}</td>
                <td>{ainfo.remarks}</td>
                <td>{ainfo.created_on}</td>
                <td>{ainfo.created_by}</td>
                <td>{ainfo.modified_on}</td>
                <td>{ainfo.modified_by}</td>
                <td>{ainfo.dev_remarks}</td>
            </tr>)}
        </tbody>
    </Table>
    </div>
  </div>
  );
};

export default AppinfoManager;