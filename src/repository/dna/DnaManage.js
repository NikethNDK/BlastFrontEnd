import React, { useEffect, useState } from "react";
import { FiEye, FiCopy, FiDownload, FiTrash } from "react-icons/fi";
import { Table, Button, Modal, Pagination } from "react-bootstrap";
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
  const [partialNames, setPartialNames] = useState([]);
  const [dnas, setDnas] = useState([]);
  const [filteredDnas, setFilteredDnas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [selectedPartialData, setSelectedPartialData] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this number

  const uniqueScientificNames = new Set(
    filteredDnas.map((dna) => dna.scientific_name)
  ).size;

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDnas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDnas.length / itemsPerPage);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filteredDnas.length]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExportToExcel = () => {
    if (!filteredDnas || filteredDnas.length === 0) {
      alert("No data available to export.");
      return;
    }

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
        setPartialNames(data);
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
          (dna.reference_id &&
            dna.reference_id
              .toString()
              .toLowerCase()
              .includes(lowerCaseQuery)) ||
          (dna.partial_name &&
            dna.partial_name.toLowerCase().includes(lowerCaseQuery)) ||
          (dna.common_name &&
            dna.common_name.toLowerCase().includes(lowerCaseQuery)) ||
          (dna.scientific_name &&
            dna.scientific_name.toLowerCase().includes(lowerCaseQuery))
        );
      });
  
      setFilteredDnas(filteredData);
    } else {
      setFilteredDnas(dnas);
    }
  }, [searchQuery, dnas]);

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
        await deleteDnaRecordAPI(reference_id);
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

  console.log("dnas", dnas);
  
  return (
    <div className="dna-manage-container">
      <header>
        <Header />
      </header>
      <div className="dna-manage-content">
        <Navigation userDetails={userDetails} />
        <div className="dna-manage-main">

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
              placeholder="Gene Name or Scientific or Common name.."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="gene-filter-buttons">
            <span className="filter-label">Quick Filter:</span>
            <button
              className={`gene-filter-btn ${searchQuery === 'Cyt-b' ? 'active' : ''}`}
              onClick={() => setSearchQuery('Cyt-b')}
            >
              Cyt-b
            </button>
            <button
              className={`gene-filter-btn ${searchQuery === '12s-RNA' ? 'active' : ''}`}
              onClick={() => setSearchQuery('12s-RNA')}
            >
              12s-RNA
            </button>
            <button
              className={`gene-filter-btn ${searchQuery === '16s-RNA' ? 'active' : ''}`}
              onClick={() => setSearchQuery('16s-RNA')}
            >
              16s-RNA
            </button>
            <button
              className={`gene-filter-btn ${searchQuery === 'COx1' ? 'active' : ''}`}
              onClick={() => setSearchQuery('COx1')}
            >
              COx-1
            </button>
            <button
              className="gene-filter-btn clear-btn"
              onClick={() => setSearchQuery('')}
            >
              Clear Filter
            </button>
          </div>
          
          <div className="dna-manage-controls">
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
                  {currentItems.map((dna) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <Pagination className="custom-pagination">
                  <Pagination.First 
                    onClick={() => handlePageChange(1)} 
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  />
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <Pagination.Ellipsis key={pageNumber} disabled />;
                    }
                    return null;
                  })}
                  
                  <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last 
                    onClick={() => handlePageChange(totalPages)} 
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
                <div className="pagination-info">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDnas.length)} of {filteredDnas.length} entries
                </div>
              </div>
            )}

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