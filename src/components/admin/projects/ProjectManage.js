import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Badge, InputGroup, Form, Alert } from "react-bootstrap";
import { FaEdit, FaPlus, FaEye, FaSearch, FaDownload, FaFilter, FaSort, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineDownload } from "react-icons/ai";
import AddProjectModal from "./AddProjectModal";
import UpdateProjectModal from "./UpdateProjectModal";
import {
  getProjectApi,
  inactiveProjectApi,
} from "../../../services/AppinfoService";
import * as XLSX from "xlsx";
import "../../styles/styles.css";
// import "../../styles/modern-design.css";

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
          setCurrentPage(1); // Reset to first page when data changes
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
      alert("Project Inactivated");
      
      // Update the projects state to mark the project as inactive
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.project_code === project_code
            ? { ...proj, deleted: 1 }
            : proj
        )
      );
    } catch (error) {
      console.error("Failed to inactivate project:", error);
      alert("Failed to Inactivate Project");
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter and sort data
  const filteredAndSortedProjects = React.useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = projects.filter(project =>
        project.project_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
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
    <div className="modern-container fade-in">
      {/* Modern Header */}
      <div className="modern-header">
        <div className="container">
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="text-gradient mb-0">
                <FaEye className="me-3" />
                Project Management
              </h1>
              <p className="mt-2 mb-0 opacity-75">
                Manage and organize your research projects efficiently
              </p>
            </Col>
            <Col md={4} className="text-end">
              <Button
                className="btn-modern btn-modern-primary"
                onClick={handleAdd}
                size="lg"
              >
                <FaPlus className="me-2" />
                Add New Project
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-5">
        <Col md={3}>
          <Card className="modern-card h-100">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <FaEye size={32} />
              </div>
              <h3 className="text-gradient mb-1">{projects.length}</h3>
              <p className="text-muted mb-0">Total Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="modern-card h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <FaCheckCircle size={32} />
              </div>
              <h3 className="text-gradient mb-1">
                {projects.filter(p => p.deleted === 0).length}
              </h3>
              <p className="text-muted mb-0">Active Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="modern-card h-100">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <FaTimesCircle size={32} />
              </div>
              <h3 className="text-gradient mb-1">
                {projects.filter(p => p.deleted === 1).length}
              </h3>
              <p className="text-muted mb-0">Inactive Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="modern-card h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <FaDownload size={32} />
              </div>
              <h3 className="text-gradient mb-1">Export</h3>
              <p className="text-muted mb-0">Download Data</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card className="modern-card">
        <Card.Header className="modern-card-header">
          <Row className="align-items-center">
            <Col md={6}>
              <h4 className="mb-0">
                <FaFilter className="me-2" />
                Project List
              </h4>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="outline-light"
                className="btn-modern"
                onClick={() => exportToExcel(projects)}
              >
                <FaDownload className="me-2" />
                Export to Excel
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="modern-card-body">
          {/* Search and Filter Bar */}
          <Row className="mb-4">
            <Col md={8}>
              <div className="modern-search">
                <FaSearch className="search-icon" />
                <Form.Control
                  type="text"
                  placeholder="Search projects by code or name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border-0 shadow-sm"
                />
              </div>
            </Col>
            <Col md={4} className="text-end">
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="btn-modern"
                  onClick={() => setSortConfig({ key: 'project_name', direction: 'asc' })}
                >
                  <FaSort className="me-1" />
                  Sort
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="btn-modern"
                  onClick={() => {
                    setSearchTerm('');
                    setSortConfig({ key: null, direction: 'asc' });
                  }}
                >
                  <FaFilter className="me-1" />
                  Clear
                </Button>
              </div>
            </Col>
          </Row>

          {/* Loading State */}
          {loading && (
            <div className="modern-spinner">
              <div className="spinner"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="danger" className="modern-card">
              <FaTimesCircle className="me-2" />
              {error}
            </Alert>
          )}

          {/* Projects Table */}
          {!loading && !error && (
            <>
              <div className="modern-table">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>
                        <div className="d-flex align-items-center">
                          Project Code
                          <FaSort className="ms-2 text-muted" size={12} />
                        </div>
                      </th>
                      <th style={{ width: '40%' }}>
                        <div className="d-flex align-items-center">
                          Project Name
                          <FaSort className="ms-2 text-muted" size={12} />
                        </div>
                      </th>
                      <th style={{ width: '15%' }}>Status</th>
                      <th style={{ width: '15%' }}>Created</th>
                      <th style={{ width: '10%' }} className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div className="text-muted">
                            <FaEye size={48} className="mb-3 opacity-50" />
                            <h5>No projects found</h5>
                            <p>Click "Add New Project" to create your first project</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedProjects.map((project, index) => (
                        <tr key={project.project_code} className="fade-in">
                          <td>
                            <div className="fw-bold text-primary">
                              {project.project_code}
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold">
                              {project.project_name}
                            </div>
                          </td>
                          <td>
                            <Badge 
                              className={`modern-badge ${
                                project.deleted === 0 
                                  ? 'modern-badge-success' 
                                  : 'modern-badge-secondary'
                              }`}
                            >
                              {project.deleted === 0 ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date().toLocaleDateString()}
                            </small>
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-1 justify-content-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="btn-modern"
                                onClick={() => handleUpdate(null, project)}
                                title="Edit Project"
                              >
                                <FaEdit size={12} />
                              </Button>
                              {project.deleted === 0 && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="btn-modern"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to inactivate this project?')) {
                                      handleInactive(project.project_code);
                                    }
                                  }}
                                  title="Inactivate Project"
                                >
                                  <FaTrash size={12} />
                                </Button>
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
                <div className="modern-pagination">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-modern"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-modern"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (page > totalPages) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline-primary"}
                        size="sm"
                        className={`btn-modern ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-modern"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-modern"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedProjects.length)} of {filteredAndSortedProjects.length} projects
                </small>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

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
  );
};

export default ProjectManage;