import React, { useEffect, useState } from "react";
import { FiEye, FiCopy, FiDownload, FiTrash } from "react-icons/fi";
import { Table, Button, Modal } from "react-bootstrap";
import { FcSearch } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import Header from "../navigation/Header";
import Navigation from "../navigation/Navigation";
import { FileDownload } from "@mui/icons-material";
import {
  getPartialApi,
  fetchDnaData,
  deleteDnaRecord as deleteDnaRecordAPI,
} from "../../services/AppinfoService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DnaManage = ({ userDetails= { name: '', lab: '', designation: '' } }) => {
  const [partialNames, setPartialNames] = useState([]); // Initialize as an empty array
  const [dnas, setDnas] = useState([]);
  const [filteredDnas, setFilteredDnas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [selectedPartialData, setSelectedPartialData] = useState(null);

  const uniqueScientificNames = new Set(
    filteredDnas.map((dna) => dna.scientific_name)
  ).size;

  const handleExportToExcel = () => {
    if (!filteredDnas || filteredDnas.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Format the table data for Excel
    const worksheet = XLSX.utils.json_to_sheet(
      filteredDnas.map(
        ({
          s_no,
          ncbi_id,
          common_name,
          scientific_name,
          reference_id,
          partial_name,
          submittedBy_name,
        }) => ({
          "NCBI ID": ncbi_id,
          "Common Name": common_name,
          "Scientific Name": scientific_name,
          "Reference ID": reference_id,
          "Gene Name": partial_name,
          "Submitted By": submittedBy_name,
        })
      )
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DNA Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelBlob, "DNA_Data.xlsx");
  };

  useEffect(() => {
    const fetchPartialNames = async () => {
      try {
        const data = await getPartialApi();
        console.log(data);
        setPartialNames(data); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching partial names:", error);
      }
    };
    fetchPartialNames();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDnaData();
        setDnas(data);
        setFilteredDnas(data);
      } catch (error) {
        console.error("Failed to load DNA data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredData = dnas.filter((dna) => {
        const lowerCaseQuery = searchQuery.toLowerCase();

        return (
          // Always check reference_id
          (dna.reference_id &&
            dna.reference_id
              .toString()
              .toLowerCase()
              .includes(lowerCaseQuery)) ||
          (partialNames.some(
            (partial) => partial.partial_name === searchQuery
          ) &&
            dna.partial_name &&
            dna.partial_name.toLowerCase().includes(lowerCaseQuery)) ||
          // Default behavior: filter by common_name or scientific_name
          (dna.common_name &&
            dna.common_name.toLowerCase().includes(lowerCaseQuery)) ||
          (dna.scientific_name &&
            dna.scientific_name.toLowerCase().includes(lowerCaseQuery))
        );
      });

      setFilteredDnas(filteredData);
    } else {
      setFilteredDnas(dnas); // If no query, show all DNA entries
    }
  }, [searchQuery, dnas, partialNames]);

  const handlePartialNameClick = (name) => {
    setSearchQuery(name);
  };

  const handleView = (partialData) => {
    setSelectedPartialData(partialData);
    setModalShow(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const handleDownload = (text) => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "partial_data.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const deleteDnaRecord = async (reference_id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDnaRecordAPI(reference_id); // Call the API function
        const updatedData = dnas.filter(
          (dna) => dna.reference_id !== reference_id
        );
        setDnas(updatedData);
        setFilteredDnas(updatedData);
        alert("DNA deleted succesfully !");
      } catch (error) {
        console.error("Error deleting DNA record:", error);
      }
    }
  };
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <Navigation />
      <div style={{ background: "#C5EA31", height: "53px" }} className="header">
        <h2
          style={{ textAlign: "center", paddingTop: "11px", marginLeft: "35%" }}
        >
          Overview
        </h2>

        {/* <button
          onClick={() => navigate("/dna")}
          className="btn btn-primary"
          style={{ marginRight: "-30%" }}
        >
          Home
        </button>
        <button
          onClick={() => navigate("/add_dna")}
          className="btn btn-primary"
          style={{ marginRight: "60px" }}
        >
          New
        </button> */}
      </div>
      <div style={{ position: "absolute", left: "1350px", top: "100px",height:"100px" }}>
          <p style={{ margin: 0,marginright:"100px" }}>User: {userDetails.name}</p>
          <p style={{ margin: 0,marginright:"100px" }}>Lab: {userDetails.lab}</p>
          <p style={{ margin: 0,marginright:"100px" }}>designation: {userDetails.designation}</p>
        </div>
      <div
        className="searchBar"
        style={{
          paddingTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label
          htmlFor="search"
          style={{ marginRight: "8px", fontWeight: "bold" }}
        >
          Search:{" "}
        </label>
        <input
          type="text"
          value={searchQuery}
          className="form-control"
          placeholder="Scientific or Common name.."
          style={{
            width: 350,
            border: "1px solid gray",
            backgroundColor: "lightyellow",
            marginRight: "1px",
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* <button
          className="btn btn-outline-secondary"
          type="button"
          style={{
            position: "absolute",
            transform: "translateY(-50%)",
            transform: "translateX(485%)",
            cursor: "pointer",
            border: "none",
            background: "none",
          }}
          onClick={() => setSearchQuery(searchQuery)}
        >
          <FcSearch />
        </button> */}
      </div>
      <p></p>
      <div style={{ display: "flex", marginLeft: "30%", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >
          {partialNames && partialNames.length > 0 ? (
            partialNames.map((name, index) => (
              <button
                key={index}
                style={{
                  color: "black",
                  borderColor: "black",
                  backgroundColor: "rgb(197, 234, 49)",
                }}
                className="btn btn-outline-primary m-1"
                onClick={() => handlePartialNameClick(name.partial_name)} // Filters the data by partial name
              >
                {name.partial_name}
              </button>
            ))
          ) : (
            <span>No partial names available</span> // Display message when no partial names are found
          )}
        </div>
        <div
          style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}
        >
          Total Unique Scientific Names:{" "}
          {new Set(filteredDnas.map((dna) => dna.scientific_name)).size}
        </div>
        <button
          onClick={handleExportToExcel}
          className="btn btn-success"
          style={{ height: "40px", alignSelf: "center" }}
        >
          <FileDownload />
        </button>
      </div>
      <p></p>
      <div>
        <div
          style={{
            margin: "auto",
            width: "73%",
            maxHeight: filteredDnas.length > 5 ? "195px" : "auto",
            overflowY: filteredDnas.length > 5 ? "auto" : "visible",
            border: "3px solid #ddd",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Table
            striped
            bordered
            hover
            style={{
              fontSize: "14px",
              width: "100%",
              textAlign: "center",
              overflowY: filteredDnas.length > 5 ? "auto" : "visible",
            }}
          >
            <thead>
              <tr>
                <th style={{ fontSize: "12px", width: "5%" }}>S.no</th>
                <th style={{ fontSize: "12px", width: "15%" }}>NCBI ID</th>
                <th style={{ fontSize: "12px", width: "10%" }}>Reference id</th>
                <th style={{ fontSize: "12px", width: "10%" }}>Gene name</th>
                <th style={{ fontSize: "12px", width: "15%" }}>Common name</th>
                <th style={{ fontSize: "12px", width: "15%" }}>
                  Scientific name
                </th>
                <th style={{ fontSize: "12px", width: "10%" }}>Submitted By</th>
                <th style={{ fontSize: "12px", width: "20%" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredDnas.map((dna) => (
                <tr key={dna.id}>
                  <td style={{ fontSize: "12px", textAlign: "center" }}>
                    {dna.s_no}
                  </td>
                  <td style={{ fontSize: "12px", textAlign: "center" }}>
                    {dna.ncbi_id}
                  </td>
                  <td style={{ fontSize: "12px", textAlign: "center" }}>
                    {dna.reference_id}
                  </td>
                  <td style={{ fontSize: "12px", textAlign: "center" }}>
                    {dna.partial_name}
                  </td>
                  <td style={{ fontSize: "12px", textAlign: "center" }}>
                    {dna.common_name}
                  </td>
                  <td style={{ fontSize: "12px", textAlign: "center" }}>
                    {dna.scientific_name}
                  </td>

                  <td style={{ fontSize: "12px", textAlign: "center" }}>
                    {dna.submittedBy_name}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <FiEye
                      size={20}
                      style={{
                        cursor: "pointer",
                        margin: "0 5px",
                        color: "black",
                      }}
                      onClick={() => handleView(dna.partial_data)}
                      title="View"
                    />
                    <FiCopy
                      size={20}
                      style={{
                        cursor: "pointer",
                        margin: "0 5px",
                        color: "grey",
                      }}
                      onClick={() => handleCopy(dna.partial_data)}
                      title="Copy"
                    />
                    <FiDownload
                      size={20}
                      style={{
                        cursor: "pointer",
                        margin: "0 5px",
                        color: "grey",
                      }}
                      onClick={() => handleDownload(dna.partial_data)}
                      title="Download"
                    />
                    <FiTrash
                      size={20}
                      style={{
                        cursor: "pointer",
                        margin: "0 5px",
                        color: "red",
                      }}
                      onClick={() => deleteDnaRecord(dna.reference_id)}
                      title="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Partial Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {selectedPartialData}
            </pre>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => handleCopy(selectedPartialData)}
            >
              Copy
            </Button>
            <Button
              variant="primary"
              onClick={() => handleDownload(selectedPartialData)}
            >
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DnaManage;
