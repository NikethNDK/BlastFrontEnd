import React, { useEffect, useState } from "react";
import { getItemIssueApi } from "../../../services/AppinfoService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../../components/Lab1/homeLab/inventory.css";

const IssuedFilter = () => {
  const [issued, setIssued] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter States
  const [entryNoFilter, setEntryNoFilter] = useState("");
  const [itemCodeFilter, setItemCodeFilter] = useState("");
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [issueDateFilter, setIssueDateFilter] = useState("");
  const [quantityIssuedFilter, setQuantityIssuedFilter] = useState("");
  const [projectCodeFilter, setProjectCodeFilter] = useState("");
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [issuedToFilter, setIssuedToFilter] = useState("");
  const [remarksFilter, setRemarksFilter] = useState("");

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

  // Filtering Logic
  useEffect(() => {
    const filteredItems = issued.filter(
      (item) =>
        (entryNoFilter === "" ||
          (item.entry_no &&
            String(item.entry_no)
              .toLowerCase()
              .includes(entryNoFilter.toLowerCase()))) &&
        (itemCodeFilter === "" ||
          (item.item_code &&
            String(item.item_code)
              .toLowerCase()
              .includes(itemCodeFilter.toLowerCase()))) &&
        (itemNameFilter === "" ||
          (item.item_name &&
            item.item_name
              .toLowerCase()
              .includes(itemNameFilter.toLowerCase()))) &&
        (issueDateFilter === "" ||
          (item.issue_date &&
            String(item.issue_date)
              .toLowerCase()
              .includes(issueDateFilter.toLowerCase()))) &&
        (quantityIssuedFilter === "" ||
          (item.quantity_issued &&
            String(item.quantity_issued)
              .toLowerCase()
              .includes(quantityIssuedFilter.toLowerCase()))) &&
        (projectCodeFilter === "" ||
          (item.project_code &&
            item.project_code
              .toLowerCase()
              .includes(projectCodeFilter.toLowerCase()))) &&
        (projectNameFilter === "" ||
          (item.project_name &&
            item.project_name
              .toLowerCase()
              .includes(projectNameFilter.toLowerCase()))) &&
        (issuedToFilter === "" ||
          (item.researcher_name &&
            item.researcher_name
              .toLowerCase()
              .includes(issuedToFilter.toLowerCase()))) &&
        (remarksFilter === "" ||
          (item.remarks &&
            item.remarks
              .toLowerCase()
              .includes(remarksFilter.toLowerCase())))
    );

    setFilteredData(filteredItems);
    setCurrentPage(1); // Reset to first page when filtering
  }, [
    issued,
    entryNoFilter,
    itemCodeFilter,
    itemNameFilter,
    issueDateFilter,
    quantityIssuedFilter,
    projectCodeFilter,
    projectNameFilter,
    issuedToFilter,
    remarksFilter,
  ]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="master-list-container" style={{ width: "100%", padding: "24px" }}>
      {/* --- Pagination Controls (Top) --- */}
      <div className="pagination-controls top">
        <div className="pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
        </div>
        <div className="pagination-options">
          <label className="items-per-page-label">
            Items per page:
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              className="items-per-page-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {/* --- Main Data Table --- */}
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              {/* Header Cells with Filters */}
              {[
                { label: "Entry No", filter: entryNoFilter, setFilter: setEntryNoFilter },
                { label: "Item Code", filter: itemCodeFilter, setFilter: setItemCodeFilter },
                { label: "Item Name", filter: itemNameFilter, setFilter: setItemNameFilter },
                { label: "Issue Date", filter: issueDateFilter, setFilter: setIssueDateFilter },
                { label: "Quantity Issued", filter: quantityIssuedFilter, setFilter: setQuantityIssuedFilter },
                { label: "Project Code", filter: projectCodeFilter, setFilter: setProjectCodeFilter },
                { label: "Project Name", filter: projectNameFilter, setFilter: setProjectNameFilter },
                { label: "Issued To", filter: issuedToFilter, setFilter: setIssuedToFilter },
                { label: "Remarks", filter: remarksFilter, setFilter: setRemarksFilter },
              ].map(({ label, filter, setFilter }) => (
                <th key={label} className="table-header">
                  {label}
                  <input
                    type="text"
                    placeholder={`Filter by ${label}`}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-input"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr
                  key={item.c_id ? `${item.c_id}-${index}` : index}
                  className="data-row"
                >
                  <td className="table-cell">{item.entry_no || "-"}</td>
                  <td className="table-cell">{item.item_code || "-"}</td>
                  <td className="table-cell">{item.item_name || "-"}</td>
                  <td className="table-cell">{item.issue_date || "-"}</td>
                  <td className="table-cell">{item.quantity_issued || "-"}</td>
                  <td className="table-cell">{item.project_code || "-"}</td>
                  <td className="table-cell">{item.project_name || "-"}</td>
                  <td className="table-cell">{item.researcher_name || "-"}</td>
                  <td className="table-cell">{item.remarks || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data-cell">
                  No items matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Controls (Bottom) --- */}
      {totalPages > 1 && (
        <div className="pagination-controls bottom">
          <div className="pagination-navigation">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn prev-btn"
            >
              <FaChevronLeft size={14} />
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-btn page-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn next-btn"
            >
              Next
              <FaChevronRight size={14} />
            </button>
          </div>
          
          <div className="pagination-summary">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuedFilter;