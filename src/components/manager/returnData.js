import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { AiOutlineDownload } from "react-icons/ai";
import Pagination from "../common/Pagination";
import { BASE_URL } from "../../services/AppinfoService";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../layout/content";
import "./dashboard/ManagerDashboard.shared.css";
import "./dashboard/ManagerReturnData.css";

const TABLE_HEADINGS = [
  { label: "Entry No", key: "entry_no", colClass: "md-rtn-col--entry" },
  { label: "Item Name", key: "item_name", colClass: "md-rtn-col--name" },
  { label: "Item Code", key: "item_code", colClass: "md-rtn-col--code" },
  { label: "Quantity Returned", key: "quantity_returned", colClass: "md-rtn-col--qty" },
  { label: "Batch Number", key: "batch_number", colClass: "md-rtn-col--batch" },
  { label: "Receipt Date", key: "receipt_date", colClass: "md-rtn-col--receipt-date" },
  { label: "Expiry Date", key: "expiry_date", colClass: "md-rtn-col--expiry" },
  { label: "Manufacturer", key: "manufacturer", colClass: "md-rtn-col--manufacturer" },
  { label: "Supplier", key: "supplier", colClass: "md-rtn-col--supplier" },
  { label: "Project Name", key: "project_name", colClass: "md-rtn-col--project" },
  { label: "Invoice No", key: "invoice_no", colClass: "md-rtn-col--invoice" },
  { label: "Return Date", key: "return_date", colClass: "md-rtn-col--return-date" },
  { label: "Remarks", key: "remarks", colClass: "md-rtn-col--remarks" },
];

const ReturnDataTable = () => {
  const location = useLocation();
  const isEmbedded = location.pathname === "/dashboard";

  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || reduxUser?.name || null;

  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLab, setSelectedLab] = useState("All");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        console.error("Username not available. Please ensure user is logged in.");
        return;
      }

      try {
        const params = { username };
        if (selectedLab !== "All") {
          params.lab = selectedLab;
        }

        const response = await axios.get(`${BASE_URL}/item_return/`, { params });
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, selectedLab]);

  useEffect(() => {
    const filteredItems = data
      .filter((item) =>
        TABLE_HEADINGS.every(({ key }) => {
          const value = filters[key];
          if (!value) return true;
          const field = item[key];
          if (field == null || field === "") return false;
          return String(field).toLowerCase().includes(value.toLowerCase());
        })
      )
      .sort((a, b) => a.entry_no - b.entry_no);

    setFilteredData(filteredItems);
    setCurrentPage(1);
  }, [data, filters]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = useCallback((e, key) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  }, []);

  const handleDownload = () => {
    if (filteredData.length === 0) {
      toast.error("No data to download!");
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
    (sum, item) => sum + (parseInt(item.quantity_returned, 10) || 0),
    0
  );

  const tableContent = (
    <div className="manager-dash-panel md-rtn-page">
      <div className="manager-dash-toolbar-row">
        <div className="manager-dash-lab-filter">
          <label htmlFor="md-rtn-lab-filter">Lab Name:</label>
          <select
            id="md-rtn-lab-filter"
            className="manager-dash-lab-select"
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
          >
            <option value="All">All</option>
            {managerLabs.map((lab, index) => (
              <option key={index} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="manager-dash-download-btn"
          title="Download Excel"
        >
          <AiOutlineDownload size={18} aria-hidden />
          Download
        </button>
      </div>

      <section className="project-panel" aria-label="Returned items">
        <div className="project-table-section">
          <div className="project-table-shell">
            <table className="project-table">
              <thead>
                <tr className="project-thead-labels">
                  {TABLE_HEADINGS.map(({ label, colClass }) => (
                    <th
                      key={colClass}
                      scope="col"
                      className={`project-th-label-cell md-rtn-col ${colClass}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
                <tr className="project-thead-filters">
                  {TABLE_HEADINGS.map(({ label, key, colClass }) => (
                    <th
                      key={key}
                      scope="col"
                      className={`project-th-filter-cell md-rtn-col ${colClass}`}
                    >
                      <input
                        type="text"
                        placeholder="Filter"
                        className="md-col-filter"
                        value={filters[key] || ""}
                        onChange={(e) => handleFilterChange(e, key)}
                        aria-label={`Filter by ${label}`}
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
                      className="project-table-row"
                    >
                      <td className="md-rtn-col md-rtn-col--entry">{item.entry_no ?? "—"}</td>
                      <td className="md-rtn-col md-rtn-col--name">{item.item_name || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--code">{item.item_code || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--qty">{item.quantity_returned ?? "—"}</td>
                      <td className="md-rtn-col md-rtn-col--batch">{item.batch_number || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--receipt-date">{item.receipt_date || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--expiry">{item.expiry_date || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--manufacturer">{item.manufacturer || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--supplier">{item.supplier || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--project">{item.project_name || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--invoice">{item.invoice_no || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--return-date">{item.return_date || "—"}</td>
                      <td className="md-rtn-col md-rtn-col--remarks">{item.remarks || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="project-table-row project-table-row--empty">
                    <td colSpan="13">
                      <div className="project-empty">
                        No items matching your filter criteria.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            showSummary
            showItemsPerPage
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(n) => {
              setItemsPerPage(n);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            position="bottom"
          />
        </div>
      </section>
    </div>
  );

  if (isEmbedded) {
    return tableContent;
  }

  return (
    <PageLayout>
      <PageHeader title="Returned items" />
      <PageBody>
        <ContentCard flush>{tableContent}</ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default ReturnDataTable;
