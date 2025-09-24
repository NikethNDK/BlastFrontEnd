import React, { useEffect, useState } from "react";
import { getDnaApi } from "../../services/AppinfoService";
import "../../App.css";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Header from "../navigation/Header";
import Navigation from "../navigation/Navigation";
const CommonNameDna = () => {
  const [dnas, setDnas] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (dnas.length && !isUpdated) {
      return;
    }

    getDnaApi()
      .then((data) => {
        if (mounted) {
          setDnas(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      mounted = false;
      setIsUpdated(false);
    };
  }, [isUpdated, dnas]);

  const columns = [
    {
      dataField: "s_no",
      text: "S.No",
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "class_name",
      text: "Class",
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "commaon_name",
      text: "Common Name",
      filter: textFilter(),
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "partial_CB_Gs",
      text: "Partial Cyt-B gene sequence",
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "partial16s_RNA_Gs",
      text: "Partial 16s rRNA gene sequence",
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "partial12s_RNA_Gs",
      text: "Partial 12s rRNA gene sequence",
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "partial16s_RNA_Ss",
      text: "Partial 16s rRNA short sequence",
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "partial12s_RNA_Ss",
      text: "Partial 12s rRNA short sequence",
      sort: false,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "sub_name_designation",
      text: "Submitted by Name and designation",
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "reference_id",
      text: "Reference ID",
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
    {
      dataField: "submission_date",
      text: "Submission Date",
      sort: true,
      headerStyle: {
        backgroundColor: "#C5EA31",
        textAlign: "center",
        border: "1px solid black",
      },
      style: { textAlign: "center", border: "1px solid black" },
    },
  ];

  return (
    <div>
      <Header />
      <Navigation />
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{
            textAlign: "center",
            paddingTop: "15px",
            marginRight: "8px",
          }}
        >
          COMMON NAME DETAILS{" "}
        </h2>
      </div>
      <div style={{ overflowY: "scroll", maxHeight: "450px" }}>
        <div className="row side-row" style={{ textAlign: "center" }}>
          <p id="manage"></p>
          <BootstrapTable
            keyField="s_no"
            data={dnas}
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

export default CommonNameDna;
