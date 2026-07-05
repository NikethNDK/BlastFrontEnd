import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { getAppinfo } from '../../services/AppinfoService';
import "../../App.css";
import { PageLayout, PageHeader, PageBody, ContentCard } from '../layout/content';

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
    <PageLayout>
    <PageHeader title="Appinfo" />
    <PageBody>
    <ContentCard flush>
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
    </ContentCard>
    </PageBody>
  </PageLayout>
  );
};

export default AppinfoManager;