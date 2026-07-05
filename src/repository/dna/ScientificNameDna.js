import React, { useEffect, useState } from "react";
import { getDnaApi } from "../../services/AppinfoService";
import "../../App.css";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../../components/layout/content";

const ScientificNameDna = () => {
  const [dnas, setDnas] = useState([]);
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
      dataField: "scientific_name",
      text: "Scientific Name",
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
      sort: true,
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
      sort: true,
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
      sort: true,
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
      sort: true,
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
      sort: true,
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
    <PageLayout>
      <PageHeader title="Scientific name details" />
      <PageBody>
      <ContentCard flush>
        <div className="lims-table-wrap row side-row">
          <BootstrapTable
            keyField="s_no"
            data={dnas}
            columns={columns}
            filter={filterFactory()}
            striped
            bordered
            hover
            className="react-bootstrap-table lims-table"
            id="dataTable"
          />
        </div>
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default ScientificNameDna;
