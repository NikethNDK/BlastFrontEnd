import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import "../../App.css";
import { NavLink } from 'react-router-dom';
import { getIssueApi } from '../../services/AppinfoService';

const ReNotification = () => {
  const [students, setNotifys] = useState([]);

  useEffect(() => {
    let mounted = true;
    getIssueApi()
      .then(data => {
        if (mounted) {
          setNotifys(data);
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
        <h2 style={{ textAlign: 'center', paddingTop: '15px' }} >TASK</h2>
      </div>
        <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
      <div className="row side-row" style={{ textAlign: 'center' }}>
        
    <p id="before-table"></p>
        <Table striped bordered hover className="react-bootstrap-table" id="dataTable">
        <thead>
            <tr>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Id</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Reseacher Name</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Issue Task</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Date</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Issue Raised By</th>
            <th style={{ backgroundColor: '#C5EA31',
                             width: '250px', 
                             color: 'black', 
                             textAlign: 'center', 
                             border: '1px solid black' }}>Issue Status</th>
            </tr>
        </thead>
        <tbody>
            {students.map((ainfo) =>
            <tr key={ainfo.id}>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{ainfo.id}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{ainfo.researcher_name}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{ainfo.issues_task}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{ainfo.date_time}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{ainfo.issue_raised_by}</td>
                <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{ainfo.issue_status}</td>
            </tr>)}
        </tbody>
    </Table>
    </div>
    </div>
  </div>
  );
};

export default ReNotification;