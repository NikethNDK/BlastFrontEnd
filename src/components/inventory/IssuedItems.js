import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { getItemIssueApi } from '../../services/AppinfoService';
import "../../App.css";
import { NavLink } from 'react-router-dom';

const IssuedItems = () => {
  const [issued, setIssued] = useState([]);

  useEffect(() => {
    let mounted = true;
    getItemIssueApi()
      .then(data => {
        if (mounted) {
          setIssued(data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  
    return () => (mounted = false);
  }, []);

  return(
    <div >
      <div style={{background: "#C5EA31", height: '70px'}} className="header">
        <h2 style={{ textAlign: 'center', paddingTop: '15px' }} >ISSUE</h2>
      </div>
        <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
      <div className="row side-row" style={{ textAlign: 'center' }}>
        <p id="before-table"></p>
        <Table striped bordered hover className="react-bootstrap-table" id="dataTable" style={{ margin: 'auto', width: '1000px' }}>
        <thead>
            <tr>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Entry No</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Item Code</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Item Name</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Units</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '350px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>IssueDate</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Quantity Issued</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Issued To</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Project Code</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Project Name</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Researcher Name</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Batch/Lot Number</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Remarks</th>
            </tr>
        </thead>
        <tbody>
            {issued.map((inven) =>
            <tr key={inven.id}>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.entry_no}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.item_code}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.item_name}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.units}</td>
                <td style={{ textAlign: 'center', 
                             width: '350px', 
                                 border: '1px solid black' }}>{inven.issue_date}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.quantity_issued}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.issued_to}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.project_code}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.project_name}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.researcher_name}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.batch_number}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{inven.remarks}</td>
            </tr>)}
        </tbody>
    </Table>
    </div>
    </div>
  </div>
  );
};

export default IssuedItems;