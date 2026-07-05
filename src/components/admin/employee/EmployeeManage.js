import React, { useEffect, useState, useMemo } from "react";
import {
  FaUserPlus,
  FaUsers,
  FaSearch,
  FaTimes,
  FaUserSlash,
} from "react-icons/fa";
import Pagination from "../../common/Pagination";
import { Modal } from "react-bootstrap";
import AddEmployeeModal from "./AddEmployeeModal";
import UpdateEmployeeModal from "./UpdateEmployeeModal";
import {
  getEmployeeApi,
  inactiveEmployeeApi,
} from "../../../services/AppinfoService";
import toast from "react-hot-toast";
import "./EmployeeManage.css";
import { PageLayout, PageHeader } from "../../layout/content";

const formatListField = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }
  return value || "";
};

const EmployeeManage = () => {
  const [employees, setEmployees] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editEmployees, setEditEmployees] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [inactiveEmployees, setInactiveEmployees] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [employeeToInactivate, setEmployeeToInactivate] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchEmployees = async () => {
      try {
        const data = await getEmployeeApi();
        if (mounted) {
          setEmployees(data);

          const storedInactive =
            JSON.parse(localStorage.getItem("inactiveEmployees")) || [];
          const inactiveSet = new Set(storedInactive);
          data.forEach((emp) => {
            if (emp.is_inactive === true) {
              inactiveSet.add(emp.emp_id);
            }
          });

          setInactiveEmployees(inactiveSet);
          localStorage.setItem(
            "inactiveEmployees",
            JSON.stringify([...inactiveSet])
          );
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
    return () => {
      mounted = false;
    };
  }, [isUpdated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [isUpdated, searchTerm]);

  const handleAdd = (e) => {
    e.preventDefault();
    setAddModalShow(true);
  };

  const handleInactiveClick = (employee) => {
    setEmployeeToInactivate(employee);
    setConfirmModalShow(true);
  };

  const handleConfirmInactive = async () => {
    if (!employeeToInactivate) return;

    try {
      await inactiveEmployeeApi(employeeToInactivate.emp_id);
      toast.success("Employee marked as inactive");
      setInactiveEmployees((prev) => {
        const updatedSet = new Set(prev).add(employeeToInactivate.emp_id);
        localStorage.setItem(
          "inactiveEmployees",
          JSON.stringify([...updatedSet])
        );
        return updatedSet;
      });
      setConfirmModalShow(false);
      setEmployeeToInactivate(null);
    } catch (error) {
      console.error("Failed to mark Employee as inactive:", error);
      toast.error("Failed to update Employee status");
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalShow(false);
    setEmployeeToInactivate(null);
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) {
      return employees;
    }

    const query = searchTerm.trim().toLowerCase();

    return employees.filter((emp) => {
      const searchable = [
        emp.emp_id,
        emp.emp_name,
        formatListField(emp.project_code),
        formatListField(emp.project_name),
        emp.lab,
        emp.designation,
      ];

      return searchable.some(
        (field) => field && String(field).toLowerCase().includes(query)
      );
    });
  }, [employees, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderProjectValues = (value) => {
    const items = Array.isArray(value)
      ? value.filter(Boolean)
      : value
        ? [value]
        : [];

    if (items.length === 0) {
      return <span className="employee-cell-muted">—</span>;
    }

    if (items.length === 1) {
      return <span>{items[0]}</span>;
    }

    return (
      <div className="employee-tags">
        {items.map((item) => (
          <span
            key={item}
            className="project-badge project-badge--secondary"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title="Employee management"
        actions={
          <button type="button" className="lims-header-btn" onClick={handleAdd}>
            <FaUserPlus aria-hidden />
            Assign employee
          </button>
        }
      />

      <div className="employee-manage">
        <section className="project-panel" aria-label="Employee list">
          <div className="project-toolbar">
            <div className="project-toolbar-filter">
              <label htmlFor="employee-search" className="project-search-label">
                Search
              </label>
              <div className="project-search">
                <FaSearch className="project-search-icon" aria-hidden />
                <input
                  id="employee-search"
                  type="search"
                  placeholder="Filter by ID, name, project, lab, or designation…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchTerm("");
                      e.currentTarget.blur();
                    }
                  }}
                  className="project-search-input"
                  autoComplete="off"
                  spellCheck={false}
                />
                {searchTerm ? (
                  <button
                    type="button"
                    className="project-search-clear"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <FaTimes aria-hidden />
                  </button>
                ) : null}
              </div>
              <span className="project-toolbar-count" aria-live="polite">
                <strong>{filteredEmployees.length}</strong> employee
                {filteredEmployees.length !== 1 ? "s" : ""}
                {searchTerm ? " matching search" : ""}
              </span>
            </div>
          </div>

          <div className="project-table-section">
            <div className="project-table-shell">
              <table className="project-table">
                <thead>
                  <tr>
                    <th scope="col">Employee ID</th>
                    <th scope="col">Employee name</th>
                    <th scope="col">Project code</th>
                    <th scope="col">Project name</th>
                    <th scope="col">Lab</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="project-th-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.length === 0 ? (
                    <tr className="project-table-row project-table-row--empty">
                      <td colSpan="8">
                        <div className="project-empty">
                          <div className="project-empty-icon-wrap">
                            {searchTerm ? (
                              <FaSearch aria-hidden />
                            ) : (
                              <FaUsers aria-hidden />
                            )}
                          </div>
                          <h3>
                            {searchTerm
                              ? "No employees found"
                              : "No employees available"}
                          </h3>
                          <p>
                            {searchTerm
                              ? "Try adjusting your search."
                              : 'Click "Assign employee" to add your first employee.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp) => {
                      const isInactive = inactiveEmployees.has(emp.emp_id);

                      return (
                        <tr
                          key={emp.emp_id}
                          className={`project-table-row${
                            isInactive ? " project-table-row--inactive" : ""
                          }`}
                        >
                          <td data-label="Employee ID">
                            <span className="employee-id">{emp.emp_id}</span>
                          </td>
                          <td data-label="Name">
                            <span className="project-name">
                              {emp.emp_name || "—"}
                            </span>
                          </td>
                          <td data-label="Project code">
                            {renderProjectValues(emp.project_code)}
                          </td>
                          <td data-label="Project name">
                            {renderProjectValues(emp.project_name)}
                          </td>
                          <td data-label="Lab">
                            {emp.lab ? (
                              <span>{emp.lab}</span>
                            ) : (
                              <span className="employee-cell-muted">—</span>
                            )}
                          </td>
                          <td data-label="Designation">
                            {emp.designation ? (
                              <span>{emp.designation}</span>
                            ) : (
                              <span className="employee-cell-muted">—</span>
                            )}
                          </td>
                          <td data-label="Status">
                            <span
                              className={`project-badge ${
                                isInactive
                                  ? "project-badge--secondary"
                                  : "project-badge--success"
                              }`}
                            >
                              {isInactive ? "Inactive" : "Active"}
                            </span>
                          </td>
                          <td
                            data-label="Actions"
                            className="project-td-actions"
                          >
                            <div className="project-row-actions">
                              {!isInactive ? (
                                <button
                                  type="button"
                                  className="project-icon-btn project-icon-btn--danger"
                                  onClick={() => handleInactiveClick(emp)}
                                  title="Mark inactive"
                                  aria-label={`Mark ${emp.emp_name || emp.emp_id} inactive`}
                                >
                                  <FaUserSlash aria-hidden />
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              showItemsPerPage
              showSummary
              totalItems={filteredEmployees.length}
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

      <AddEmployeeModal
        show={addModalShow}
        setUpdated={() => setIsUpdated((prev) => !prev)}
        onHide={() => setAddModalShow(false)}
      />

      <UpdateEmployeeModal
        show={editModalShow}
        setUpdated={() => setIsUpdated((prev) => !prev)}
        onHide={() => setEditModalShow(false)}
        employee={editEmployees}
      />

      <Modal
        show={confirmModalShow}
        onHide={handleCloseConfirmModal}
        size="sm"
        centered
        backdrop="static"
        dialogClassName="project-modal project-modal--confirm"
        contentClassName="project-modal-content"
      >
        <div className="project-modal-header">
          <button
            type="button"
            className="project-modal-close"
            onClick={handleCloseConfirmModal}
            aria-label="Close"
          >
            <FaTimes aria-hidden />
          </button>
          <h2 className="project-modal-title">Inactivate employee?</h2>
          <p className="project-modal-description">
            This will mark the employee as inactive. You can reactivate them later.
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          {employeeToInactivate && (
            <div className="project-modal-highlight">
              <div className="project-modal-highlight-row">
                <span className="project-modal-highlight-label">ID</span>
                <span>{employeeToInactivate.emp_id}</span>
              </div>
              <div className="project-modal-highlight-row">
                <span className="project-modal-highlight-label">Name</span>
                <span>{employeeToInactivate.emp_name || "N/A"}</span>
              </div>
              {employeeToInactivate.designation ? (
                <div className="project-modal-highlight-row">
                  <span className="project-modal-highlight-label">Role</span>
                  <span>{employeeToInactivate.designation}</span>
                </div>
              ) : null}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="project-modal-footer">
          <button
            type="button"
            className="project-btn project-btn-outline"
            onClick={handleCloseConfirmModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="project-btn project-btn-danger-solid"
            onClick={handleConfirmInactive}
          >
            Inactivate
          </button>
        </Modal.Footer>
      </Modal>
    </PageLayout>
  );
};

export default EmployeeManage;
