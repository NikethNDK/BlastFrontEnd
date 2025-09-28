import React, { useEffect, useState } from "react";
import { FiEye, FiCopy, FiDownload, FiTrash } from "react-icons/fi";
import { Table, Button, Modal } from "react-bootstrap";
import { FcSearch } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Lab1/homeLab/Header";
import Navigation from "../navigation/Navigation";
import { FileDownload } from "@mui/icons-material";
import {
  getPartialApi,
  fetchDnaData,
  deleteDnaRecord as deleteDnaRecordAPI,
} from "../../services/AppinfoService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./DnaManage.css";

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
    <div className="dna-manage-container">
      <Header />
      <div className="dna-manage-content">
        <Navigation userDetails={userDetails} />
        <div className="dna-manage-main">
          <div className="dna-manage-header">
            <h2 className="dna-manage-title">
              Overview
            </h2>
          </div>

          <div className="dna-manage-search-bar">
            <label
              htmlFor="search"
              className="search-label"
            >
              Search:{" "}
            </label>
            <input
              type="text"
              value={searchQuery}
              className="form-control search-input"
              placeholder="Scientific or Common name.."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="dna-manage-controls">
            <div className="partial-names-container">
              {partialNames && partialNames.length > 0 ? (
                partialNames.map((name, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-primary partial-name-button"
                    onClick={() => handlePartialNameClick(name.partial_name)} // Filters the data by partial name
                  >
                    {name.partial_name}
                  </button>
                ))
              ) : (
                <span className="no-partial-names-message">No partial names available</span> // Display message when no partial names are found
              )}
            </div>
            <div className="unique-names-counter">
              Total Unique Scientific Names:{" "}
              {new Set(filteredDnas.map((dna) => dna.scientific_name)).size}
            </div>
            <button
              onClick={handleExportToExcel}
              className="btn btn-success export-button"
            >
              <FileDownload />
            </button>
          </div>
          
          <div className="dna-manage-table-section">
            <div className="table-container">
              <Table
                striped
                bordered
                hover
                className="dna-data-table"
              >
                <thead>
                  <tr>
                    <th className="table-header table-header-sno">S.no</th>
                    <th className="table-header table-header-ncbi">NCBI ID</th>
                    <th className="table-header table-header-reference">Reference id</th>
                    <th className="table-header table-header-gene">Gene name</th>
                    <th className="table-header table-header-common">Common name</th>
                    <th className="table-header table-header-scientific">
                      Scientific name
                    </th>
                    <th className="table-header table-header-submitted">Submitted By</th>
                    <th className="table-header table-header-details">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDnas.map((dna) => (
                    <tr key={dna.id} className="table-row">
                      <td className="table-cell table-cell-sno">
                        {dna.s_no}
                      </td>
                      <td className="table-cell table-cell-ncbi">
                        {dna.ncbi_id}
                      </td>
                      <td className="table-cell table-cell-reference">
                        {dna.reference_id}
                      </td>
                      <td className="table-cell table-cell-gene">
                        {dna.partial_name}
                      </td>
                      <td className="table-cell table-cell-common">
                        {dna.common_name}
                      </td>
                      <td className="table-cell table-cell-scientific">
                        {dna.scientific_name}
                      </td>
                      <td className="table-cell table-cell-submitted">
                        {dna.submittedBy_name}
                      </td>
                      <td className="table-cell table-cell-actions">
                        <FiEye
                          size={20}
                          className="action-icon view-icon"
                          onClick={() => handleView(dna.partial_data)}
                          title="View"
                        />
                        <FiCopy
                          size={20}
                          className="action-icon copy-icon"
                          onClick={() => handleCopy(dna.partial_data)}
                          title="Copy"
                        />
                        <FiDownload
                          size={20}
                          className="action-icon download-icon"
                          onClick={() => handleDownload(dna.partial_data)}
                          title="Download"
                        />
                        <FiTrash
                          size={20}
                          className="action-icon delete-icon"
                          onClick={() => deleteDnaRecord(dna.reference_id)}
                          title="Delete"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <Modal 
              show={modalShow} 
              onHide={() => setModalShow(false)} 
              centered
              className="partial-data-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title>Partial Data</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-body-content">
                <pre className="partial-data-content">
                  {selectedPartialData}
                </pre>
              </Modal.Body>
              <Modal.Footer className="modal-footer-actions">
                <Button
                  variant="secondary"
                  onClick={() => handleCopy(selectedPartialData)}
                  className="modal-copy-button"
                >
                  Copy
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleDownload(selectedPartialData)}
                  className="modal-download-button"
                >
                  Download
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DnaManage;