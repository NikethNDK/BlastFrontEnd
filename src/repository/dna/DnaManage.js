import React, { useEffect, useState } from "react";
import { FiEye, FiCopy, FiDownload, FiTrash } from "react-icons/fi";
import { Button, Modal } from "react-bootstrap";
import LimsPagination from "../../components/common/Pagination";
import { FcSearch } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import AppShell from "../../components/layout/AppShell";
import AppSidebar from "../../components/layout/AppSidebar";
import { repositoryMenuConfig } from "../../config/sidebar/repositoryMenu";
import { FileDownload } from "@mui/icons-material";
import {
  getPartialApi,
  fetchDnaData,
  deleteDnaRecord as deleteDnaRecordAPI,
} from "../../services/AppinfoService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./DnaManage.css";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../../components/layout/content";

const TABLE_HEADINGS = [
  { label: "S.no", colClass: "dna-col--sno" },
  { label: "NCBI ID", colClass: "dna-col--ncbi" },
  { label: "Reference id", colClass: "dna-col--reference" },
  { label: "Gene name", colClass: "dna-col--gene" },
  { label: "Common name", colClass: "dna-col--common" },
  { label: "Scientific name", colClass: "dna-col--scientific" },
  { label: "Submitted By", colClass: "dna-col--submitted" },
  { label: "Details", colClass: "dna-col--actions" },
];

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
    <AppShell
      sidebar={
        <AppSidebar config={repositoryMenuConfig} userDetails={userDetails} />
      }
    >
      <PageLayout>
        <PageHeader title="DNA management" />
        <PageBody>
        <ContentCard className="dna-manage-main">
          <div className="dna-manage-page">
            <div className="dna-manage-search-bar">
              <label
                htmlFor="search"
                className="search-label"
              >
                Search:{" "}
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                className="search-input"
                placeholder="Gene Name or Scientific or Common name.."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="gene-filter-buttons">
              <span className="filter-label">Quick Filter:</span>
              <button
                type="button"
                className={`gene-filter-btn ${searchQuery === 'Cyt-b' ? 'active' : ''}`}
                onClick={() => setSearchQuery('Cyt-b')}
              >
                Cyt-b
              </button>
              <button
                type="button"
                className={`gene-filter-btn ${searchQuery === '12s-RNA' ? 'active' : ''}`}
                onClick={() => setSearchQuery('12s-RNA')}
              >
                12s-RNA
              </button>
              <button
                type="button"
                className={`gene-filter-btn ${searchQuery === '16s-RNA' ? 'active' : ''}`}
                onClick={() => setSearchQuery('16s-RNA')}
              >
                16s-RNA
              </button>
              <button
                type="button"
                className={`gene-filter-btn ${searchQuery === 'COx1' ? 'active' : ''}`}
                onClick={() => setSearchQuery('COx1')}
              >
                COx-1
              </button>
              <button
                type="button"
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
                type="button"
                onClick={handleExportToExcel}
                className="export-button"
                title="Export to Excel"
              >
                <FileDownload />
              </button>
            </div>
            
            <section className="project-panel dna-manage-table-section" aria-label="DNA records">
              <div className="project-table-section">
                <div className="project-table-shell table-container">
                  <table className="project-table dna-data-table">
                    <thead>
                      <tr className="project-thead-labels">
                        {TABLE_HEADINGS.map(({ label, colClass }) => (
                          <th
                            key={colClass}
                            scope="col"
                            className={`project-th-label-cell dna-col ${colClass}`}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((dna) => (
                        <tr key={dna.id} className="project-table-row table-row">
                          <td className="dna-col dna-col--sno table-cell table-cell-sno">
                            {dna.s_no}
                          </td>
                          <td className="dna-col dna-col--ncbi table-cell table-cell-ncbi">
                            {dna.ncbi_id}
                          </td>
                          <td className="dna-col dna-col--reference table-cell table-cell-reference">
                            {dna.reference_id}
                          </td>
                          <td className="dna-col dna-col--gene table-cell table-cell-gene">
                            {dna.partial_name}
                          </td>
                          <td className="dna-col dna-col--common table-cell table-cell-common">
                            {dna.common_name}
                          </td>
                          <td className="dna-col dna-col--scientific table-cell table-cell-scientific">
                            {dna.scientific_name}
                          </td>
                          <td className="dna-col dna-col--submitted table-cell table-cell-submitted">
                            {dna.submittedBy_name}
                          </td>
                          <td className="dna-col dna-col--actions table-cell table-cell-actions">
                            <FiEye
                              size={18}
                              className="action-icon view-icon"
                              onClick={() => handleView(dna.partial_data)}
                              title="View"
                            />
                            <FiCopy
                              size={18}
                              className="action-icon copy-icon"
                              onClick={() => handleCopy(dna.partial_data)}
                              title="Copy"
                            />
                            <FiDownload
                              size={18}
                              className="action-icon download-icon"
                              onClick={() => handleDownload(dna.partial_data)}
                              title="Download"
                            />
                            <FiTrash
                              size={18}
                              className="action-icon delete-icon"
                              onClick={() => deleteDnaRecord(dna.reference_id)}
                              title="Delete"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <LimsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredDnas.length}
                    startIndex={indexOfFirstItem}
                    endIndex={indexOfLastItem}
                    position="bottom"
                  />
                )}

                <Modal 
                  show={modalShow} 
                  onHide={() => setModalShow(false)} 
                  centered
                  scrollable
                  size="lg"
                  dialogClassName="project-modal project-modal--form partial-data-modal"
                  contentClassName="project-modal-content"
                  aria-labelledby="dna-partial-modal-title"
                >
                  <div className="project-modal-header">
                    <button
                      type="button"
                      className="project-modal-close"
                      onClick={() => setModalShow(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h2 id="dna-partial-modal-title" className="project-modal-title">
                      Partial Data
                    </h2>
                  </div>
                  <Modal.Body className="project-modal-body modal-body-content">
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
            </section>
          </div>
        </ContentCard>
        </PageBody>
      </PageLayout>
    </AppShell>
  );
};

export default DnaManage;
