import React,{ useEffect, useState }from 'react';
import {Table} from 'react-bootstrap';

import {Button,ButtonToolbar } from 'react-bootstrap';
import { getIssueApi } from '../../services/AppinfoService';
import AddResearcherIssueTask from './AddResearcherIssueTask';



const TaskManage = () => {
    const [issues, setIssues] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editIssues, setEditIssues] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
      let mounted = true;
    
      console.log('Effect triggered. Checking conditions...');
    
      if (issues.length && !isUpdated) {
        console.log('Data already present and not updated. Returning early.');
        return;
      }
    
      console.log('Fetching new data...');
    
      getIssueApi()
        .then(data => {
          if (mounted) {
            console.log('Data received:', data);
            setIssues(data);
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
    }, [isUpdated, issues]);
    
    

    const handleAdd = (e) => {
        e.preventDefault();
        setAddModalShow(true);
    };

    
    let AddModelClose=()=>setAddModalShow(false);
    let EditModelClose=()=>setEditModalShow(false);
    return(
      <div >
        <div style={{background: "#C5EA31", height: '70px'}} className="header">
          <h2 style={{ textAlign: 'center', paddingTop: '15px' }} >ISSUE TASK</h2>
        </div>
          <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <div className="row side-row" style={{ textAlign: 'center' }}>
            <ButtonToolbar>
                <Button variant="primary" onClick={handleAdd}>
                Add Task
                </Button>
                <AddResearcherIssueTask show={addModalShow} setUpdated={setIsUpdated}
                onHide={AddModelClose}></AddResearcherIssueTask>
            </ButtonToolbar>
          <p id="before-table"></p>
            <Table striped bordered hover className="react-bootstrap-table" id="dataTable" style={{ margin: 'auto', width: '1000px' }}>
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
                             border: '1px solid black' }}>Researcher Name</th>
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
                {issues.map((is) => (
                  <tr key={is.id}>
                      <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{is.id}</td>
                      <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{is.researcher_name || ''}</td>
                      <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{is.issues_task || ''}</td>
                      <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{is.date_time || ''}</td>
                      <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{is.issue_raised_by || ''}</td>
                      <td style={{ textAlign: 'center', 
                                 border: '1px solid black' }}>{is.issue_status || ''}</td>
                  </tr>))}

              </tbody>
            </Table>
        </div>
        </div>
        </div>
    );
};

export default TaskManage;