import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaDownload,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaFolderOpen,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import { Modal } from "react-bootstrap";
import AddProjectModal from "./AddProjectModal";
import UpdateProjectModal from "./UpdateProjectModal";
import {
  getProjectApi,
  inactiveProjectApi,
} from "../../../services/AppinfoService";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import Pagination from "../../common/Pagination";
import "./ProjectManage.css";
import { PageLayout, PageHeader } from "../../layout/content";

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editProjects, setEditProjects] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [projectToInactivate, setProjectToInactivate] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProjectApi();
        if (mounted) {
          setProjects(data);
          setCurrentPage(1);
        }
      } catch (fetchError) {
        console.error("Error fetching data:", fetchError);
        if (mounted) {
          setError("Failed to load projects. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, [isUpdated]);

  const handleAdd = (e) => {
    e.preventDefault();
    setAddModalShow(true);
  };

  const handleUpdate = (e, project) => {
    e.preventDefault();
    setEditModalShow(true);
    setEditProjects(project);
  };

  const handleInactiveClick = (project) => {
    setProjectToInactivate(project);
    setConfirmModalShow(true);
  };

  const handleConfirmInactive = async () => {
    if (!projectToInactivate) return;

    try {
      await inactiveProjectApi(projectToInactivate.project_code);
      toast.success("Project inactivated");

      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.project_code === projectToInactivate.project_code
            ? { ...proj, deleted: 1 }
            : proj
        )
      );
      setConfirmModalShow(false);
      setProjectToInactivate(null);
    } catch (inactiveError) {
      console.error("Failed to inactivate project:", inactiveError);
      toast.error("Failed to inactivate project");
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalShow(false);
    setProjectToInactivate(null);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
  };

  const filteredAndSortedProjects = React.useMemo(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = projects.filter(
        (project) =>
          project.project_code
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [projects, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / pageSize);
  const paginatedProjects = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedProjects.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedProjects, currentPage, pageSize]);
  const paginationStartIndex = (currentPage - 1) * pageSize;
  const paginationEndIndex = paginationStartIndex + pageSize;

  const activeCount = projects.filter((p) => p.deleted === 0).length;
  const inactiveCount = projects.filter((p) => p.deleted === 1).length;

  let AddModelClose = () => setAddModalShow(false);
  let EditModelClose = () => setEditModalShow(false);

  const exportToExcel = (data = filteredAndSortedProjects) => {
    if (!data.length) {
      toast.error("No projects to export");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "project_data.xlsx");
    toast.success("Export started");
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="project-sort-icon project-sort-icon--idle" aria-hidden />;
    }
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="project-sort-icon" aria-hidden />
    ) : (
      <FaSortDown className="project-sort-icon" aria-hidden />
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title="Project management"
        actions={
          <button
            type="button"
            className="lims-header-btn project-btn project-btn-primary"
            onClick={handleAdd}
          >
            <FaPlus aria-hidden />
            Add project
          </button>
        }
      />

      <div className="project-manage">
        <div className="project-stats" role="list">
          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--total">
              <FaFolderOpen aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{projects.length}</span>
              <span className="project-stat-label">Total projects</span>
            </div>
          </div>

          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--active">
              <FaCheckCircle aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{activeCount}</span>
              <span className="project-stat-label">Active</span>
            </div>
          </div>

          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--inactive">
              <FaTimesCircle aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{inactiveCount}</span>
              <span className="project-stat-label">Inactive</span>
            </div>
          </div>

          <button
            type="button"
            className="project-stat-card project-stat-card--action"
            onClick={() => exportToExcel()}
            aria-label="Export projects to Excel"
          >
            <div className="project-stat-icon project-stat-icon--export">
              <FaFileExcel aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value project-stat-value--action">
                Export
              </span>
              <span className="project-stat-label">Download Excel</span>
            </div>
            <FaDownload className="project-stat-action-hint" aria-hidden />
          </button>
        </div>

        <section className="project-panel" aria-label="Project list">
          <div className="project-toolbar">
            <div className="project-toolbar-filter">
              <label htmlFor="project-search" className="project-search-label">
                Search
              </label>
              <div className="project-search">
                <FaSearch className="project-search-icon" aria-hidden />
                <input
                  id="project-search"
                  type="search"
                  placeholder="Filter by project code or name…"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      handleSearch("");
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
                    onClick={() => handleSearch("")}
                    aria-label="Clear search"
                  >
                    <FaTimes aria-hidden />
                  </button>
                ) : null}
              </div>
              {!loading && !error ? (
                <span className="project-toolbar-count" aria-live="polite">
                  <strong>{filteredAndSortedProjects.length}</strong> project
                  {filteredAndSortedProjects.length !== 1 ? "s" : ""}
                  {searchTerm ? " matching search" : ""}
                </span>
              ) : null}
            </div>
            <div className="project-toolbar-actions">
              <button
                type="button"
                className="project-btn project-btn-ghost"
                onClick={() => handleSort("project_name")}
              >
                {renderSortIcon("project_name")}
                Sort by name
              </button>
              <button
                type="button"
                className="project-btn project-btn-ghost"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            </div>
          </div>

          {loading && (
            <div className="project-loading" role="status" aria-live="polite">
              <div className="project-spinner" />
              <span>Loading projects…</span>
            </div>
          )}

          {error && (
            <div className="project-alert project-alert-danger" role="alert">
              <FaTimesCircle aria-hidden />
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="project-table-section">
              <div className="project-table-shell">
                <table className="project-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <button
                          type="button"
                          className="project-th-sort"
                          onClick={() => handleSort("project_code")}
                        >
                          Project code
                          {renderSortIcon("project_code")}
                        </button>
                      </th>
                      <th scope="col">
                        <button
                          type="button"
                          className="project-th-sort"
                          onClick={() => handleSort("project_name")}
                        >
                          Project name
                          {renderSortIcon("project_name")}
                        </button>
                      </th>
                      <th scope="col">Status</th>
                      <th scope="col">Created</th>
                      <th scope="col" className="project-th-actions">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.length === 0 ? (
                      <tr className="project-table-row project-table-row--empty">
                        <td colSpan="5">
                          <div className="project-empty">
                            <div className="project-empty-icon-wrap">
                              <FaFolderOpen aria-hidden />
                            </div>
                            <h3>No projects found</h3>
                            <p>
                              {searchTerm
                                ? "Try adjusting your search or clear filters."
                                : 'Click "Add project" to create your first project.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedProjects.map((project) => (
                        <tr key={project.project_code} className="project-table-row">
                          <td data-label="Code">
                            <span className="project-code">
                              {project.project_code}
                            </span>
                          </td>
                          <td data-label="Name">
                            <span className="project-name">
                              {project.project_name}
                            </span>
                          </td>
                          <td data-label="Status">
                            <span
                              className={`project-badge ${
                                project.deleted === 0
                                  ? "project-badge--success"
                                  : "project-badge--secondary"
                              }`}
                            >
                              {project.deleted === 0 ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td data-label="Created">
                            <time
                              className="project-date"
                              dateTime={project.created_at || undefined}
                            >
                              {project.created_at
                                ? new Date(
                                    project.created_at
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "—"}
                            </time>
                          </td>
                          <td data-label="Actions" className="project-td-actions">
                            <div className="project-row-actions">
                              <button
                                type="button"
                                className="project-icon-btn project-icon-btn--edit"
                                onClick={(e) => handleUpdate(e, project)}
                                title="Edit project"
                                aria-label={`Edit ${project.project_name}`}
                              >
                                <FaEdit aria-hidden />
                              </button>
                              {project.deleted === 0 && (
                                <button
                                  type="button"
                                  className="project-icon-btn project-icon-btn--danger"
                                  onClick={() => handleInactiveClick(project)}
                                  title="Inactivate project"
                                  aria-label={`Inactivate ${project.project_name}`}
                                >
                                  <FaTrash aria-hidden />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={filteredAndSortedProjects.length}
                  startIndex={paginationStartIndex}
                  endIndex={paginationEndIndex}
                  position="bottom"
                />
              )}
            </div>
          )}
        </section>

        <AddProjectModal
          show={addModalShow}
          setUpdated={setIsUpdated}
          onHide={AddModelClose}
          projects={projects || []}
        />

        <UpdateProjectModal
          show={editModalShow}
          setUpdated={setIsUpdated}
          onHide={EditModelClose}
          editProjects={editProjects}
          projects={projects || []}
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
            <h2 className="project-modal-title">Inactivate project?</h2>
            <p className="project-modal-description">
              This will mark the project as inactive. You can reactivate it later.
            </p>
          </div>
          <Modal.Body className="project-modal-body">
            {projectToInactivate && (
              <div className="project-modal-highlight">
                <div className="project-modal-highlight-row">
                  <span className="project-modal-highlight-label">Code</span>
                  <span className="project-code-chip--compact">
                    {projectToInactivate.project_code}
                  </span>
                </div>
                <div className="project-modal-highlight-row">
                  <span className="project-modal-highlight-label">Name</span>
                  <span>{projectToInactivate.project_name}</span>
                </div>
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
      </div>
    </PageLayout>
  );
};

export default ProjectManage;
