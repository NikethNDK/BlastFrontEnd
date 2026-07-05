import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { getItemReceiveApi } from "../../../services/AppinfoService";
import "./ManagerDashboard.shared.css";
import "./ReceivedFilter.css";

const TABLE_HEADINGS = [
  { label: "Item Code", key: "item_code", colClass: "md-rcv-col--code" },
  { label: "Item Name", key: "item_name", colClass: "md-rcv-col--name" },
  { label: "Project Name", key: "project_name", colClass: "md-rcv-col--project-name" },
  { label: "Project Code", key: "project_code", colClass: "md-rcv-col--project-code" },
  { label: "Receipt Date", key: "receipt_date", colClass: "md-rcv-col--receipt-date" },
  { label: "Expiry Date", key: "expiry_date", colClass: "md-rcv-col--expiry" },
  { label: "Quantity Received", key: "quantity_received", colClass: "md-rcv-col--qty" },
  { label: "Manufacturer", key: "manufacturer", colClass: "md-rcv-col--manufacturer" },
  { label: "Supplier", key: "supplier", colClass: "md-rcv-col--supplier" },
  { label: "Invoice No/Date", key: "invoice_no", colClass: "md-rcv-col--invoice" },
  { label: "PO Number", key: "po_number", colClass: "md-rcv-col--po" },
  { label: "Batch/Lot Number", key: "batch_number", colClass: "md-rcv-col--batch" },
  { label: "Remarks", key: "remarks", colClass: "md-rcv-col--remarks" },
];

const ReceivedFilter = ({ setReceivedCount }) => {
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || reduxUser?.name || null;

  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);

  const [receive, setReceive] = useState([]);
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
        const labParam = selectedLab !== "All" ? selectedLab : null;
        const response = await getItemReceiveApi(username, labParam);
        const { new_data, all_data } = response;

        setReceive(all_data || []);

        if (new_data && new_data.length > 0) {
          setReceivedCount(new_data.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (username) {
      fetchData();
    }
  }, [setReceivedCount, username, selectedLab]);

  useEffect(() => {
    const filteredItems = receive.filter((item) =>
      TABLE_HEADINGS.every(({ key }) => {
        const value = filters[key];
        if (!value) return true;
        const field = item[key];
        if (field == null || field === "") return false;
        return String(field).toLowerCase().includes(value.toLowerCase());
      })
    );

    setFilteredData(filteredItems);
    setCurrentPage(1);
  }, [receive, filters]);

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

  return (
    <div className="manager-dash-panel md-rcv-page">
      <div className="manager-dash-lab-filter">
        <label htmlFor="md-rcv-lab-filter">Lab Name:</label>
        <select
          id="md-rcv-lab-filter"
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

      <section className="project-panel" aria-label="Received items">
        <div className="project-table-section">
          <div className="project-table-shell">
            <table className="project-table">
              <thead>
                <tr className="project-thead-labels">
                  {TABLE_HEADINGS.map(({ label, colClass }) => (
                    <th
                      key={colClass}
                      scope="col"
                      className={`project-th-label-cell md-rcv-col ${colClass}`}
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
                      className={`project-th-filter-cell md-rcv-col ${colClass}`}
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
                    <tr key={item.entry_no || index} className="project-table-row">
                      <td className="md-rcv-col md-rcv-col--code">{item.item_code || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--name">{item.item_name || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--project-name">{item.project_name || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--project-code">{item.project_code || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--receipt-date">{item.receipt_date || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--expiry">{item.expiry_date || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--qty">{item.quantity_received ?? "—"}</td>
                      <td className="md-rcv-col md-rcv-col--manufacturer">{item.manufacturer || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--supplier">{item.supplier || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--invoice">{item.invoice_no || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--po">{item.po_number || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--batch">{item.batch_number || "—"}</td>
                      <td className="md-rcv-col md-rcv-col--remarks">{item.remarks || "—"}</td>
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
};

export default ReceivedFilter;
