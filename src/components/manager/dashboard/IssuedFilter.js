import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../../../App.css";
import { getItemIssueApi } from "../../../services/AppinfoService";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const IssuedFilter = () => {
  const [issued, setIssued] = useState([]);

  useEffect(() => {
    let mounted = true;
    getItemIssueApi()
      .then((data) => {
        if (mounted) {
          setIssued(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  // Define your columns as you did before
  const columns = [
    {
      dataField: "entry_no",
      text: "Entry No",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "item_code",
      text: "Item Code",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "item_name",
      text: "Item Name",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    // {
    //     dataField: 'units',
    //     text: 'Units',
    //     sort: true,
    //     headerStyle: { backgroundColor: '#C5EA31',
    //     width: '50px',
    //     color: 'black',
    //     textAlign: 'center',
    //     border: '1px solid black' },
    //     style: { textAlign: 'center',
    //             border: '1px solid black' }
    // },
    {
      dataField: "issue_date",
      text: "IssueDate",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "quantity_issued",
      text: "Quantity Issued",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    // {
    //     dataField: 'issued_to',
    //     text: 'Issued To',
    //     sort: true,
    //     headerStyle: { backgroundColor: '#C5EA31',
    //     width: '50px',
    //     color: 'black',
    //     textAlign: 'center',
    //     border: '1px solid black' },
    //     style: { textAlign: 'center',
    //             border: '1px solid black' }
    // },
    {
      dataField: "project_code",
      text: "Project Code",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "project_name",
      text: "Project Name",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "researcher_name",
      text: "Issued To",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    // {
    //     dataField: 'batch_number',
    //     text: 'Batch/Lot Number',
    //     sort: true,
    //     headerStyle: { backgroundColor: '#C5EA31',
    //     width: '50px',
    //     color: 'black',
    //     textAlign: 'center',
    //     border: '1px solid black' },
    //     style: { textAlign: 'center',
    //             border: '1px solid black' }
    // },
    {
      dataField: "remarks",
      text: "Remarks",
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "50px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
  ];

  return (
    <div>
      {/* <div style={{ background: "#C5EA31", height: "50px" }} className="header">
        <h2 style={{ textAlign: "center", paddingTop: "5px" }}>ISSUE</h2>
      </div> */}
      <div
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          maxHeight: "290px",
          marginTop: "10px",
        }}
      >
        <div className="row side-row" style={{ textAlign: "center" }}>
          <BootstrapTable
            keyField={(row, index) => `${row.c_id}-${index}`}
            data={issued}
            columns={columns}
            filter={filterFactory()}
            striped
            bordered
            hover
            className="react-bootstrap-table"
            id="dataTable"
            style={{ margin: "auto", width: "1000px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default IssuedFilter;
