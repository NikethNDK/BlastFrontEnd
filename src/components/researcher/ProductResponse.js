import React, { useEffect, useState } from 'react';
import {Modal, Table} from 'react-bootstrap';
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { getProductReqApi } from '../../services/AppinfoService';

const NoteStatus  = (props) => {
    const [status, setStatus] = useState([]);
  
    useEffect(() => {
      let mounted = true;
      getProductReqApi()
        .then(data => {
          if (mounted) {
            setStatus(data);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    
      return () => (mounted = false);
    }, []);
  

    return(
        <div className="container">

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >

                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Request Status
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover className="react-bootstrap-table" id="dataTable">
                      <thead>
                        <tr>
                          <th>RequestDate</th>
                          <th>RequestedBy</th>
                          <th>RequestedTo</th>
                          <th>RequestDetails</th>
                          <th>RequestStatus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {status.map((st) =>
                          <tr key={st.c_id}>
                            <td>{st.RequestDate}</td>
                            <td>{st.RequestedBy}</td>
                            <td>{st.RequestedTo}</td>
                            <td>{st.RequestDetails}</td>
                            <td>{st.RequestStatus}</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default NoteStatus;