import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { AiOutlineDownload } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BASE_URL } from "../../services/AppinfoService";
import "../../components/Lab1/homeLab/inventory.css";

const ReturnDataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter States
  const [entryNoFilter, setEntryNoFilter] = useState("");
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [itemCodeFilter, setItemCodeFilter] = useState("");
  const [quantityReturnedFilter, setQuantityReturnedFilter] = useState("");
  const [batchNumberFilter, setBatchNumberFilter] = useState("");
  const [receiptDateFilter, setReceiptDateFilter] = useState("");
  const [expiryDateFilter, setExpiryDateFilter] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [invoiceNoFilter, setInvoiceNoFilter] = useState("");
  const [returnDateFilter, setReturnDateFilter] = useState("");
  const [remarksFilter, setRemarksFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/item_return/`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filtering Logic
  useEffect(() => {
    const filteredItems = data
      .filter(
        (item) =>
          (entryNoFilter === "" ||
            (item.entry_no &&
              String(item.entry_no)
                .toLowerCase()
                .includes(entryNoFilter.toLowerCase()))) &&
          (itemNameFilter === "" ||
            (item.item_name &&
              item.item_name
                .toLowerCase()
                .includes(itemNameFilter.toLowerCase()))) &&
          (itemCodeFilter === "" ||
            (item.item_code &&
              String(item.item_code)
                .toLowerCase()
                .includes(itemCodeFilter.toLowerCase()))) &&
          (quantityReturnedFilter === "" ||
            (item.quantity_returned &&
              String(item.quantity_returned)
                .toLowerCase()
                .includes(quantityReturnedFilter.toLowerCase()))) &&
          (batchNumberFilter === "" ||
            (item.batch_number &&
              String(item.batch_number)
                .toLowerCase()
                .includes(batchNumberFilter.toLowerCase()))) &&
          (receiptDateFilter === "" ||
            (item.receipt_date &&
              String(item.receipt_date)
                .toLowerCase()
                .includes(receiptDateFilter.toLowerCase()))) &&
          (expiryDateFilter === "" ||
            (item.expiry_date &&
              String(item.expiry_date)
                .toLowerCase()
                .includes(expiryDateFilter.toLowerCase()))) &&
          (manufacturerFilter === "" ||
            (item.manufacturer &&
              item.manufacturer
                .toLowerCase()
                .includes(manufacturerFilter.toLowerCase()))) &&
          (supplierFilter === "" ||
            (item.supplier &&
              item.supplier
                .toLowerCase()
                .includes(supplierFilter.toLowerCase()))) &&
          (projectNameFilter === "" ||
            (item.project_name &&
              item.project_name
                .toLowerCase()
                .includes(projectNameFilter.toLowerCase()))) &&
          (invoiceNoFilter === "" ||
            (item.invoice_no &&
              String(item.invoice_no)
                .toLowerCase()
                .includes(invoiceNoFilter.toLowerCase()))) &&
          (returnDateFilter === "" ||
            (item.return_date &&
              String(item.return_date)
                .toLowerCase()
                .includes(returnDateFilter.toLowerCase()))) &&
          (remarksFilter === "" ||
            (item.remarks &&
              item.remarks
                .toLowerCase()
                .includes(remarksFilter.toLowerCase())))
      )
      .sort((a, b) => a.entry_no - b.entry_no);

    setFilteredData(filteredItems);
    setCurrentPage(1); // Reset to first page when filtering
  }, [
    data,
    entryNoFilter,
    itemNameFilter,
    itemCodeFilter,
    quantityReturnedFilter,
    batchNumberFilter,
    receiptDateFilter,
    expiryDateFilter,
    manufacturerFilter,
    supplierFilter,
    projectNameFilter,
    invoiceNoFilter,
    returnDateFilter,
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

  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Entry No": item.entry_no,
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        "Quantity Returned": item.quantity_returned,
        "Batch Number": item.batch_number,
        "Receipt Date": item.receipt_date,
        "Expiry Date": item.expiry_date,
        Manufacturer: item.manufacturer,
        Supplier: item.supplier,
        "Project Name": item.project_name,
        "Invoice No": item.invoice_no,
        "Return Date": item.return_date,
        Remarks: item.remarks,
      }))
    );

    worksheet["!protect"] = {
      password: "readonly",
      edit: false,
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Return Data");
    XLSX.writeFile(workbook, "ReturnData.xlsx");
  };

  // Kept for potential future use (not currently displayed)
  // eslint-disable-next-line no-unused-vars
  const totalQuantityReceived = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_returned) || 0),
    0
  );

  return (
    <div className="master-list-container" style={{ width: "100%", padding: "24px" }}>
      {/* --- Download Button --- */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button
          onClick={handleDownload}
          className="download-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <AiOutlineDownload size={18} />
          Download
        </button>
      </div>

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
                { label: "Item Name", filter: itemNameFilter, setFilter: setItemNameFilter },
                { label: "Item Code", filter: itemCodeFilter, setFilter: setItemCodeFilter },
                { label: "Quantity Returned", filter: quantityReturnedFilter, setFilter: setQuantityReturnedFilter },
                { label: "Batch Number", filter: batchNumberFilter, setFilter: setBatchNumberFilter },
                { label: "Receipt Date", filter: receiptDateFilter, setFilter: setReceiptDateFilter },
                { label: "Expiry Date", filter: expiryDateFilter, setFilter: setExpiryDateFilter },
                { label: "Manufacturer", filter: manufacturerFilter, setFilter: setManufacturerFilter },
                { label: "Supplier", filter: supplierFilter, setFilter: setSupplierFilter },
                { label: "Project Name", filter: projectNameFilter, setFilter: setProjectNameFilter },
                { label: "Invoice No", filter: invoiceNoFilter, setFilter: setInvoiceNoFilter },
                { label: "Return Date", filter: returnDateFilter, setFilter: setReturnDateFilter },
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
                  key={item.id || item.entry_no || index}
                  className="data-row"
                >
                  <td className="table-cell">{item.entry_no || "-"}</td>
                  <td className="table-cell">{item.item_name || "-"}</td>
                  <td className="table-cell">{item.item_code || "-"}</td>
                  <td className="table-cell">{item.quantity_returned || "-"}</td>
                  <td className="table-cell">{item.batch_number || "-"}</td>
                  <td className="table-cell">{item.receipt_date || "-"}</td>
                  <td className="table-cell">{item.expiry_date || "-"}</td>
                  <td className="table-cell">{item.manufacturer || "-"}</td>
                  <td className="table-cell">{item.supplier || "-"}</td>
                  <td className="table-cell">{item.project_name || "-"}</td>
                  <td className="table-cell">{item.invoice_no || "-"}</td>
                  <td className="table-cell">{item.return_date || "-"}</td>
                  <td className="table-cell">{item.remarks || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="no-data-cell">
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

export default ReturnDataTable;