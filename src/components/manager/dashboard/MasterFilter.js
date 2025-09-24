import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getMasterApi } from "../../../services/AppinfoService";
import "../../../App.css";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const MasterFilter = () => {
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    let mounted = true;
    getMasterApi()
      .then((data) => {
        if (mounted) {
          setMasters(data);
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
      dataField: "c_id",
      text: "Id",
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
    //   dataField: 'entry_no',
    //   text: 'Entry No',
    //   sort: false,
    //   headerStyle: { backgroundColor: '#C5EA31',
    //   width: '50px',
    //   color: 'black',
    //   textAlign: 'center',
    //   border: '1px solid black' },
    //   style: { textAlign: 'center',
    //            border: '1px solid black' }
    // },
    {
      dataField: "item_code",
      text: "Item Code",
      filter: textFilter(),
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "100px",
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
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "100px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    // {
    //   dataField: "m_date",
    //   text: "Date",
    //   filter: textFilter(),
    //   sort: true,
    //   headerStyle: {
    //     backgroundColor: "#C5EA31",
    //     width: "250px",
    //     color: "black",
    //     textAlign: "center",
    //     border: "1px solid black",
    //   },
    //   style: { textAlign: "center", border: "1px solid black" },
    // },
    {
      dataField: "supplier",
      text: "Supplier",
      filter: textFilter(),
      sort: false,
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
      dataField: "master_type",
      text: "Master Type",
      filter: textFilter(),
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "150px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "quantity",
      text: "Quantity",
      filter: textFilter(),
      sort: false,
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
      dataField: "units",
      text: "Units",
      sort: false,
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
      dataField: "price",
      text: "Price",
      sort: false,
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
      dataField: "project_code",
      text: "Project Code",
      filter: textFilter(),
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        width: "250px",
        color: "black",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "remarks",
      text: "Remarks",
      sort: false,
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
      <div style={{ background: "#C5EA31", height: "50px" }} className="header">
        <h2 style={{ textAlign: "center", paddingTop: "5px" }}>Dashboard</h2>
      </div>
      <div style={{ overflowY: "scroll", maxHeight: "480px" }}>
        <div className="row side-row" style={{ textAlign: "center" }}>
          <BootstrapTable
            keyField={(row, index) => `${row.c_id}-${index}`}
            data={masters}
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

export default MasterFilter;
