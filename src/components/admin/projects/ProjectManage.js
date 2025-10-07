import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaEye, FaSearch, FaDownload, FaFilter, FaSort, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AddProjectModal from "./AddProjectModal";
import UpdateProjectModal from "./UpdateProjectModal";
import {
  getProjectApi,
  inactiveProjectApi,
} from "../../../services/AppinfoService";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import "./ProjectManage.css";

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleUpdate = (e, stu) => {
    e.preventDefault();
    setEditModalShow(true);
    setEditProjects(stu);
  };

  const handleInactive = async (project_code) => {
    try {
      await inactiveProjectApi(project_code);
      toast.success("Project Inactivated");
      
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.project_code === project_code
            ? { ...proj, deleted: 1 }
            : proj
        )
      );
    } catch (error) {
      console.error("Failed to inactivate project:", error);
      toast.error("Failed to Inactivate Project");
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter and sort data
  const filteredAndSortedProjects = React.useMemo(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = projects.filter(project =>
        project.project_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [projects, searchTerm, sortConfig]);

  // Paginate data
  const totalPages = Math.ceil(filteredAndSortedProjects.length / pageSize);
  const paginatedProjects = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedProjects.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedProjects, currentPage, pageSize]);

  let AddModelClose = () => setAddModalShow(false);
  let EditModelClose = () => setEditModalShow(false);

  const exportToExcel = (data = projects) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "project_data.xlsx");
  };

  return (
    <div className="project-manage-container">
      <div className="project-manage-wrapper">
        {/* Header */}
        <div className="project-manage-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1>
                <FaEye style={{ marginRight: '0.75rem' }} />
                PROJECT MANAGEMENT
              </h1>
              <p>Manage and organize your research projects efficiently</p>
            </div>
            <button className="project-btn project-btn-primary project-btn-lg" onClick={handleAdd}>
              <FaPlus />
              Add New Project
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="project-stats-container">
          <div className="project-stat-card">
            <div className="project-stat-icon primary">
              <FaEye />
            </div>
            <div className="project-stat-value">{projects.length}</div>
            <p className="project-stat-label">Total Projects</p>
          </div>
          
          <div className="project-stat-card">
            <div className="project-stat-icon success">
              <FaCheckCircle />
            </div>
            <div className="project-stat-value">
              {projects.filter(p => p.deleted === 0).length}
            </div>
            <p className="project-stat-label">Active Projects</p>
          </div>
          
          <div className="project-stat-card">
            <div className="project-stat-icon warning">
              <FaTimesCircle />
            </div>
            <div className="project-stat-value">
              {projects.filter(p => p.deleted === 1).length}
            </div>
            <p className="project-stat-label">Inactive Projects</p>
          </div>
          
          <div className="project-stat-card">
            <div className="project-stat-icon info">
              <FaDownload />
            </div>
            <p className="project-stat-label">Download Data</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="project-content-card">
          <div className="project-content-header">
            <h4>
              <FaFilter />
              Project List
            </h4>
            <button 
              className="project-btn project-btn-outline-light"
              onClick={() => exportToExcel(projects)}
            >
              <FaDownload />
              Export to Excel
            </button>
          </div>

          <div className="project-content-body">
            {/* Search and Filter Bar */}
            <div className="project-search-bar">
              <div className="project-search-wrapper">
                <FaSearch className="project-search-icon" />
                <input
                  type="text"
                  placeholder="Search projects by code or name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="project-search-input"
                />
              </div>
              <div className="project-filter-buttons">
                <button
                  className="project-btn project-btn-outline-primary project-btn-sm"
                  onClick={() => handleSort('project_name')}
                >
                  <FaSort />
                  Sort
                </button>
                <button
                  className="project-btn project-btn-outline-secondary project-btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSortConfig({ key: null, direction: 'asc' });
                  }}
                >
                  <FaFilter />
                  Clear
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="project-loading">
                <div className="project-spinner"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="project-alert project-alert-danger">
                <FaTimesCircle />
                {error}
              </div>
            )}

            {/* Projects Table */}
            {!loading && !error && (
              <>
                <div className="project-table-wrapper">
                  <table className="project-table">
                    <thead>
                      <tr>
                        <th style={{ width: '20%' }}>
                          <div 
                            className="project-table-header-sortable"
                            onClick={() => handleSort('project_code')}
                          >
                            Project Code
                            <FaSort className="project-table-sort-icon" />
                          </div>
                        </th>
                        <th style={{ width: '40%' }}>
                          <div 
                            className="project-table-header-sortable"
                            onClick={() => handleSort('project_name')}
                          >
                            Project Name
                            <FaSort className="project-table-sort-icon" />
                          </div>
                        </th>
                        <th style={{ width: '15%' }}>Status</th>
                        <th style={{ width: '15%' }}>Created</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProjects.length === 0 ? (
                        <tr>
                          <td colSpan="5">
                            <div className="project-empty-state">
                              <FaEye className="project-empty-icon" />
                              <h5>No projects found</h5>
                              <p>Click "Add New Project" to create your first project</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedProjects.map((project) => (
                          <tr key={project.project_code}>
                            <td>
                              <div style={{ fontWeight: '600', color: '#007bff' }}>
                                {project.project_code}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: '500' }}>
                                {project.project_name}
                              </div>
                            </td>
                            <td>
                              <span 
                                className={`project-badge ${
                                  project.deleted === 0 
                                    ? 'project-badge-success' 
                                    : 'project-badge-secondary'
                                }`}
                              >
                                {project.deleted === 0 ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <small style={{ color: '#6c757d' }}>
                                {new Date().toLocaleDateString()}
                              </small>
                            </td>
                            <td>
                              <div className="project-action-buttons">
                                <button
                                  className="project-btn project-btn-outline-primary project-btn-sm"
                                  onClick={(e) => handleUpdate(e, project)}
                                  title="Edit Project"
                                >
                                  <FaEdit />
                                </button>
                                {project.deleted === 0 && (
                                  <button
                                    className="project-btn project-btn-outline-danger project-btn-sm"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to inactivate this project?')) {
                                        handleInactive(project.project_code);
                                      }
                                    }}
                                    title="Inactivate Project"
                                  >
                                    <FaTrash />
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <>
                    <div className="project-pagination">
                      <button
                        className="project-btn project-btn-outline-primary project-btn-sm"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </button>
                      <button
                        className="project-btn project-btn-outline-primary project-btn-sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (page > totalPages) return null;
                        
                        return (
                          <button
                            key={page}
                            className={`project-btn project-btn-outline-primary project-btn-sm ${
                              currentPage === page ? 'active' : ''
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        className="project-btn project-btn-outline-primary project-btn-sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                      <button
                        className="project-btn project-btn-outline-primary project-btn-sm"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </button>
                    </div>

                    {/* Pagination Info */}
                    <div className="project-pagination-info">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedProjects.length)} of {filteredAndSortedProjects.length} projects
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modals */}
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
      </div>
    </div>
  );
};

export default ProjectManage;