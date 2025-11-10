import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../../components/Lab1/homeLab/inventory.css";

const ReceivedFilter = ({ setReceivedCount }) => {
  const [receive, setReceive] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter States
  const [itemCodeFilter, setItemCodeFilter] = useState("");
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [projectCodeFilter, setProjectCodeFilter] = useState("");
  const [receiptDateFilter, setReceiptDateFilter] = useState("");
  const [expiryDateFilter, setExpiryDateFilter] = useState("");
  const [quantityReceivedFilter, setQuantityReceivedFilter] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [invoiceNoFilter, setInvoiceNoFilter] = useState("");
  const [poNumberFilter, setPoNumberFilter] = useState("");
  const [batchNumberFilter, setBatchNumberFilter] = useState("");
  const [remarksFilter, setRemarksFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/itemreceive/");
        const { new_data, all_data } = response.data;

        setReceive(all_data);

        if (new_data && new_data.length > 0) {
          setReceivedCount(new_data.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [setReceivedCount]);

  // Filtering Logic
  useEffect(() => {
    const filteredItems = receive.filter(
      (item) =>
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
        (projectNameFilter === "" ||
          (item.project_name &&
            item.project_name
              .toLowerCase()
              .includes(projectNameFilter.toLowerCase()))) &&
        (projectCodeFilter === "" ||
          (item.project_code &&
            item.project_code
              .toLowerCase()
              .includes(projectCodeFilter.toLowerCase()))) &&
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
        (quantityReceivedFilter === "" ||
          (item.quantity_received &&
            String(item.quantity_received)
              .toLowerCase()
              .includes(quantityReceivedFilter.toLowerCase()))) &&
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
        (invoiceNoFilter === "" ||
          (item.invoice_no &&
            String(item.invoice_no)
              .toLowerCase()
              .includes(invoiceNoFilter.toLowerCase()))) &&
        (poNumberFilter === "" ||
          (item.po_number &&
            String(item.po_number)
              .toLowerCase()
              .includes(poNumberFilter.toLowerCase()))) &&
        (batchNumberFilter === "" ||
          (item.batch_number &&
            String(item.batch_number)
              .toLowerCase()
              .includes(batchNumberFilter.toLowerCase()))) &&
        (remarksFilter === "" ||
          (item.remarks &&
            item.remarks
              .toLowerCase()
              .includes(remarksFilter.toLowerCase())))
    );

    setFilteredData(filteredItems);
    setCurrentPage(1); // Reset to first page when filtering
  }, [
    receive,
    itemCodeFilter,
    itemNameFilter,
    projectNameFilter,
    projectCodeFilter,
    receiptDateFilter,
    expiryDateFilter,
    quantityReceivedFilter,
    manufacturerFilter,
    supplierFilter,
    invoiceNoFilter,
    poNumberFilter,
    batchNumberFilter,
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
                { label: "Item Code", filter: itemCodeFilter, setFilter: setItemCodeFilter },
                { label: "Item Name", filter: itemNameFilter, setFilter: setItemNameFilter },
                { label: "Project Name", filter: projectNameFilter, setFilter: setProjectNameFilter },
                { label: "Project Code", filter: projectCodeFilter, setFilter: setProjectCodeFilter },
                { label: "Receipt Date", filter: receiptDateFilter, setFilter: setReceiptDateFilter },
                { label: "Expiry Date", filter: expiryDateFilter, setFilter: setExpiryDateFilter },
                { label: "Quantity Received", filter: quantityReceivedFilter, setFilter: setQuantityReceivedFilter },
                { label: "Manufacturer", filter: manufacturerFilter, setFilter: setManufacturerFilter },
                { label: "Supplier", filter: supplierFilter, setFilter: setSupplierFilter },
                { label: "Invoice No/Date", filter: invoiceNoFilter, setFilter: setInvoiceNoFilter },
                { label: "PO Number", filter: poNumberFilter, setFilter: setPoNumberFilter },
                { label: "Batch/Lot Number", filter: batchNumberFilter, setFilter: setBatchNumberFilter },
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
                  key={item.entry_no || index}
                  className="data-row"
                >
                  <td className="table-cell">{item.item_code || "-"}</td>
                  <td className="table-cell">{item.item_name || "-"}</td>
                  <td className="table-cell">{item.project_name || "-"}</td>
                  <td className="table-cell">{item.project_code || "-"}</td>
                  <td className="table-cell">{item.receipt_date || "-"}</td>
                  <td className="table-cell">{item.expiry_date || "-"}</td>
                  <td className="table-cell">{item.quantity_received || "-"}</td>
                  <td className="table-cell">{item.manufacturer || "-"}</td>
                  <td className="table-cell">{item.supplier || "-"}</td>
                  <td className="table-cell">{item.invoice_no || "-"}</td>
                  <td className="table-cell">{item.po_number || "-"}</td>
                  <td className="table-cell">{item.batch_number || "-"}</td>
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

export default ReceivedFilter;