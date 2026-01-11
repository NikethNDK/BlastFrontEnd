import React, { useState, useEffect, useMemo } from "react";
import {
  addLoginApi,
  getLabsApi,
  getDesignationsApi,
  getAllUsersApi,
  updateLoginApi,
} from "../../services/AppinfoService";
import { FaEye, FaEyeSlash, FaUserPlus, FaUser, FaLock, FaBriefcase, FaFlask, FaSearch, FaChevronLeft, FaChevronRight, FaEdit } from "react-icons/fa";
import { Table, Modal, Button, Form, InputGroup, Card, Badge } from "react-bootstrap";
import Select from "react-select";
import toast from "react-hot-toast";
import "./Register.css";

// Register Modal Component
const RegisterModal = ({ 
  show, 
  onHide, 
  onSuccess,
  labs,
  designations,
  isLoading 
}) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: "#dee2e6",
      padding: "0.125rem",
      fontSize: "0.875rem",
      "&:hover": {
        borderColor: "#007bff",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      fontSize: "0.875rem",
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#007bff" : isFocused ? "#f8f9fa" : "#fff",
      color: isSelected ? "#fff" : "#495057",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e7f3ff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#007bff",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#007bff",
      "&:hover": {
        backgroundColor: "#007bff",
        color: "#fff",
      },
    }),
  };

  const handleRegister = async () => {
    if (
      !username ||
      !password ||
      !role ||
      !designation ||
      selectedLabs.length === 0
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    // Add validation for Lab Assistant - must have exactly one lab
    if (role === "Lab Assistant" && selectedLabs.length !== 1) {
      toast.error("Lab Assistant must be assigned to exactly one lab.");
      return;
    }

    const selectedLabIds = selectedLabs.map((lab) => lab.value);

    if (isNaN(parseInt(designation, 10))) {
      toast.error("Please select a valid designation.");
      return;
    }

    const requestData = {
      user_name: username,
      name: name || null,
      password,
      role,
      designation: parseInt(designation, 10),
      lab: selectedLabIds,
    };

    try {
      await addLoginApi(requestData);
      toast.success("Registered Successfully");

      // Reset form
      setUsername("");
      setName("");
      setPassword("");
      setRole("");
      setDesignation("");
      setSelectedLabs([]);
      
      // Close modal and refresh
      onHide();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to register", error);
      toast.error("Failed to Register");
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setUsername("");
    setName("");
    setPassword("");
    setRole("");
    setDesignation("");
    setSelectedLabs([]);
    onHide();
  };

  return (
    <>
      <style>
        {`
          .custom-modal-width .modal-dialog {
            max-width: 550px;
            width: 100%;
          }
          .custom-modal-width .modal-content {
            max-width: 550px;
            width: 100%;
          }
          body > div[id*="react-select"] {
            z-index: 10000 !important;
          }
        `}
      </style>
      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserPlus style={{ marginRight: "8px" }} />
            Register New User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px" }}>
          <div className="register-form">
            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaUser className="label-icon" />
                Username
              </label>
              <input
                type="text"
                value={username}
                className="form-input-register"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaUser className="label-icon" />
                Name
              </label>
              <input
                type="text"
                value={name}
                className="form-input-register"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaLock className="label-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="form-input-register"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaBriefcase className="label-icon" />
                Role
              </label>
              <select
                className="form-select-register"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Lab Assistant">Lab Assistant</option>
                <option value="Researcher">Researcher</option>
              </select>
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaBriefcase className="label-icon" />
                Designation
              </label>
              <select
                className="form-select-register"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="">Select Designation</option>
                {isLoading ? (
                  <option>Loading...</option>
                ) : (
                  designations.map((des) => (
                    <option key={des.id} value={des.id}>
                      {des.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaFlask className="label-icon" />
                Labs
              </label>
              <Select
                options={labs}
                isMulti={role !== "Lab Assistant"}  // Single select for Lab Assistant
                styles={customSelectStyles}
                value={selectedLabs}
                onChange={(selectedOptions) => {
                  if (role === "Lab Assistant") {
                    // For Lab Assistant, only allow single selection
                    setSelectedLabs(selectedOptions ? [selectedOptions] : []);
                  } else {
                    setSelectedLabs(selectedOptions || []);
                  }
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={role === "Lab Assistant" ? "Select lab..." : "Select labs..."}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRegister}>
            <FaUserPlus style={{ marginRight: "8px" }} />
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Edit User Modal Component
const EditUserModal = ({ 
  show, 
  onHide, 
  onSuccess,
  user,
  labs,
  designations,
  isLoading 
}) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [originalUsername, setOriginalUsername] = useState("");

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: "#dee2e6",
      padding: "0.125rem",
      fontSize: "0.875rem",
      "&:hover": {
        borderColor: "#007bff",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      fontSize: "0.875rem",
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#007bff" : isFocused ? "#f8f9fa" : "#fff",
      color: isSelected ? "#fff" : "#495057",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e7f3ff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#007bff",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#007bff",
      "&:hover": {
        backgroundColor: "#007bff",
        color: "#fff",
      },
    }),
  };

  // Populate form when user prop changes
  useEffect(() => {
    if (user && show) {
      setOriginalUsername(user.username || "");
      setUsername(user.username || "");
      setName(user.name || "");
      setRole(user.role || "");
      
      // Find designation ID by title
      const designationObj = designations.find(des => des.title === user.designation);
      setDesignation(designationObj ? designationObj.id.toString() : "");
      
      // Map lab names to select options
      if (user.lab && user.lab.length > 0) {
        const labOptions = user.lab.map(labName => {
          const labObj = labs.find(lab => lab.label === labName);
          return labObj ? { value: labObj.value, label: labObj.label } : null;
        }).filter(Boolean);
        setSelectedLabs(labOptions);
      } else {
        setSelectedLabs([]);
      }
    }
  }, [user, show, labs, designations]);

  const handleUpdate = async () => {
    if (
      !username ||
      !role ||
      !designation ||
      selectedLabs.length === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Add validation for Lab Assistant - must have exactly one lab
    if (role === "Lab Assistant" && selectedLabs.length !== 1) {
      toast.error("Lab Assistant must be assigned to exactly one lab.");
      return;
    }

    const selectedLabIds = selectedLabs.map((lab) => lab.value);

    if (isNaN(parseInt(designation, 10))) {
      toast.error("Please select a valid designation.");
      return;
    }

    const requestData = {
      user_name: username,
      name: name || null,
      role,
      designation: parseInt(designation, 10),
      lab: selectedLabIds,
    };

    try {
      await updateLoginApi(originalUsername, requestData);
      toast.success("User updated successfully");

      // Close modal and refresh
      onHide();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to update user", error);
      const errorMessage = error.message || "Failed to update user";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setUsername("");
    setName("");
    setRole("");
    setDesignation("");
    setSelectedLabs([]);
    setOriginalUsername("");
    onHide();
  };

  return (
    <>
      <style>
        {`
          .custom-modal-width .modal-dialog {
            max-width: 550px;
            width: 100%;
          }
          .custom-modal-width .modal-content {
            max-width: 550px;
            width: 100%;
          }
          body > div[id*="react-select"] {
            z-index: 10000 !important;
          }
        `}
      </style>
      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit style={{ marginRight: "8px" }} />
            Edit User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px" }}>
          <div className="register-form">
            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaUser className="label-icon" />
                Username
              </label>
              <input
                type="text"
                value={username}
                className="form-input-register"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaUser className="label-icon" />
                Name
              </label>
              <input
                type="text"
                value={name}
                className="form-input-register"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaBriefcase className="label-icon" />
                Role
              </label>
              <select
                className="form-select-register"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Lab Assistant">Lab Assistant</option>
                <option value="Researcher">Researcher</option>
              </select>
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaBriefcase className="label-icon" />
                Designation
              </label>
              <select
                className="form-select-register"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="">Select Designation</option>
                {isLoading ? (
                  <option>Loading...</option>
                ) : (
                  designations.map((des) => (
                    <option key={des.id} value={des.id}>
                      {des.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group-register" style={{ marginBottom: "15px" }}>
              <label className="form-label-register">
                <FaFlask className="label-icon" />
                Labs
              </label>
              <Select
                options={labs}
                isMulti={role !== "Lab Assistant"}  // Single select for Lab Assistant
                styles={customSelectStyles}
                value={selectedLabs}
                onChange={(selectedOptions) => {
                  if (role === "Lab Assistant") {
                    // For Lab Assistant, only allow single selection
                    setSelectedLabs(selectedOptions ? [selectedOptions] : []);
                  } else {
                    setSelectedLabs(selectedOptions || []);
                  }
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={role === "Lab Assistant" ? "Select lab..." : "Select labs..."}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            <FaEdit style={{ marginRight: "8px" }} />
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

function Register({ userDetails = { name: "", lab: "", designation: "" } }) {
  // Form states for labs and designations
  const [designations, setDesignations] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Table and modal states
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAllUsersApi();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch labs and designations
  useEffect(() => {
    getLabsApi()
      .then((response) => {
        setLabs(
          response.data.map((lab) => ({
            value: lab.id,
            label: lab.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching labs data", error);
      });

    getDesignationsApi()
      .then((response) => {
        setIsLoading(false);
        if (Array.isArray(response.data)) {
          setDesignations(response.data);
        } else {
          console.error(
            "Unexpected API response for designations:",
            response.data
          );
          setDesignations([]);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching designations data", error);
        setDesignations([]);
      });
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = users.filter((user) => {
        const usernameMatch = user.username?.toLowerCase().includes(searchLower);
        const nameMatch = user.name?.toLowerCase().includes(searchLower);
        const roleMatch = user.role?.toLowerCase().includes(searchLower);
        const designationMatch = user.designation?.toLowerCase().includes(searchLower);
        const labsMatch = user.lab?.some((lab) => lab.toLowerCase().includes(searchLower));
        
        return usernameMatch || nameMatch || roleMatch || designationMatch || labsMatch;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';
        
        // Handle null/undefined values
        if (!aValue && !bValue) return 0;
        if (!aValue) return 1;
        if (!bValue) return -1;
        
        // Convert to string for comparison
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
        
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
  }, [users, searchTerm, sortConfig]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div style={{ 
      padding: "24px", 
      backgroundColor: "#f8f9fa", 
      minHeight: "100vh"
    }}>
      <div style={{ 
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* Compact Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: "1.75rem", 
              fontWeight: 600,
              color: "#212529"
            }}>
              User Management
            </h2>
            <p style={{ 
              margin: "4px 0 0 0", 
              color: "#6c757d", 
              fontSize: "0.875rem" 
            }}>
              Manage users, roles, and lab assignments
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
            style={{ 
              padding: "10px 20px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaUserPlus />
            Add User
          </Button>
        </div>

        {/* Search and Stats Bar */}
        <div style={{ 
          display: "flex", 
          gap: "16px", 
          marginBottom: "20px",
          alignItems: "center"
        }}>
          <div style={{ flex: 1 }}>
            <InputGroup>
              <InputGroup.Text style={{ 
                backgroundColor: "#fff",
                border: "1px solid #dee2e6"
              }}>
                <FaSearch style={{ color: "#6c757d" }} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by username, name, role, designation, or lab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  border: "1px solid #dee2e6",
                  fontSize: "0.9rem"
                }}
              />
            </InputGroup>
          </div>
          <div style={{ 
            display: "flex", 
            gap: "12px",
            alignItems: "center",
            fontSize: "0.875rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}>
            <span style={{ fontWeight: 500 }}>
              Total Users: <strong style={{ color: "#007bff" }}>{filteredUsers.length}</strong>
            </span>
          </div>
        </div>

        {/* Main Table Card */}
        <Card style={{ 
          border: "1px solid #dee2e6",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          {loadingUsers ? (
            <div style={{ 
              padding: "60px 20px", 
              textAlign: "center",
              backgroundColor: "#fff"
            }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ 
                marginTop: "16px", 
                color: "#6c757d",
                fontSize: "0.9rem"
              }}>
                Loading users...
              </p>
            </div>
          ) : (
            <>
              {/* --- Pagination Controls (Top) --- */}
              <div className="pagination-controls top" style={{ padding: "1rem 1.5rem", margin: 0 }}>
                <div className="pagination-info">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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

              <div 
                className="register-table-wrapper" 
                style={{ 
                  margin: "0 1.5rem",
                  overflow: "visible"
                }}
              >
                <Table 
                  hover 
                  className="register-users-table"
                  style={{ 
                    marginBottom: 0,
                    fontSize: "0.875rem",
                    width: "100%",
                    tableLayout: "auto"
                  }}
                >
                  <thead>
                    <tr style={{ 
                      backgroundColor: "#f8f9fa",
                      borderBottom: "2px solid #dee2e6"
                    }}>
                      <th 
                        style={{ 
                          padding: "14px 12px", 
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "#495057",
                          border: "none",
                          cursor: "pointer",
                          userSelect: "none",
                          width: "15%"
                        }}
                        onClick={() => handleSort('username')}
                      >
                        Username
                        {sortConfig.key === 'username' && (
                          <span style={{ marginLeft: "5px" }}>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        style={{ 
                          padding: "14px 12px", 
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "#495057",
                          border: "none",
                          cursor: "pointer",
                          userSelect: "none",
                          width: "15%"
                        }}
                        onClick={() => handleSort('name')}
                      >
                        Name
                        {sortConfig.key === 'name' && (
                          <span style={{ marginLeft: "5px" }}>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th style={{ 
                        padding: "14px 12px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none",
                        width: "12%"
                      }}>
                        Role
                      </th>
                      <th style={{ 
                        padding: "14px 12px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none",
                        width: "18%"
                      }}>
                        Designation
                      </th>
                      <th style={{ 
                        padding: "14px 12px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none",
                        width: "20%"
                      }}>
                        Labs
                      </th>
                      <th style={{ 
                        padding: "14px 12px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none",
                        width: "100px",
                        minWidth: "100px"
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td 
                          colSpan="6" 
                          style={{ 
                            textAlign: "center", 
                            padding: "60px 20px",
                            color: "#6c757d",
                            backgroundColor: "#fff",
                            border: "none"
                          }}
                        >
                          {searchTerm ? (
                            <div>
                              <FaSearch style={{ 
                                fontSize: "2.5rem", 
                                marginBottom: "16px", 
                                opacity: 0.3,
                                color: "#6c757d"
                              }} />
                              <p style={{ 
                                margin: 0, 
                                fontSize: "1rem",
                                fontWeight: 500
                              }}>
                                No users found matching your search
                              </p>
                              <p style={{ 
                                margin: "8px 0 0 0", 
                                fontSize: "0.875rem",
                                color: "#adb5bd"
                              }}>
                                Try adjusting your search criteria
                              </p>
                            </div>
                          ) : (
                            <div>
                              <FaUser style={{ 
                                fontSize: "2.5rem", 
                                marginBottom: "16px", 
                                opacity: 0.3,
                                color: "#6c757d"
                              }} />
                              <p style={{ 
                                margin: 0, 
                                fontSize: "1rem",
                                fontWeight: 500
                              }}>
                                No users available
                              </p>
                              <p style={{ 
                                margin: "8px 0 0 0", 
                                fontSize: "0.875rem",
                                color: "#adb5bd"
                              }}>
                                Click "Add User" to create your first user
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user, index) => (
                        <tr 
                          key={index}
                          style={{ 
                            borderBottom: index === paginatedUsers.length - 1 ? "none" : "1px solid #f0f0f0",
                            transition: "background-color 0.15s ease"
                          }}
                        >
                          <td style={{ 
                            padding: "14px 12px",
                            verticalAlign: "middle",
                            fontWeight: 500,
                            color: "#212529",
                            border: "none"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "#e7f3ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#007bff",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                flexShrink: 0
                              }}>
                                {user.username?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {user.username || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td style={{ 
                            padding: "14px 12px",
                            verticalAlign: "middle",
                            fontWeight: 500,
                            color: "#212529",
                            border: "none"
                          }}>
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                              {user.name || (
                                <span style={{ 
                                  color: "#adb5bd", 
                                  fontStyle: "italic",
                                  fontSize: "0.85rem"
                                }}>
                                  N/A
                                </span>
                              )}
                            </span>
                          </td>
                          <td style={{ 
                            padding: "14px 12px",
                            verticalAlign: "middle",
                            border: "none"
                          }}>
                            <Badge 
                              bg="primary" 
                              style={{ 
                                padding: "6px 10px",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                borderRadius: "6px",
                                whiteSpace: "nowrap"
                              }}
                            >
                              {user.role || "N/A"}
                            </Badge>
                          </td>
                          <td style={{ 
                            padding: "14px 12px",
                            verticalAlign: "middle",
                            color: "#495057",
                            border: "none"
                          }}>
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                              {user.designation || "N/A"}
                            </span>
                          </td>
                          <td style={{ 
                            padding: "14px 12px",
                            verticalAlign: "middle",
                            border: "none"
                          }}>
                            {user.lab && user.lab.length > 0 ? (
                              <div style={{ 
                                display: "flex", 
                                flexWrap: "wrap", 
                                gap: "6px" 
                              }}>
                                {user.lab.map((lab, labIndex) => (
                                  <span
                                    key={labIndex}
                                    style={{
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      backgroundColor: "#f0f0f0",
                                      fontSize: "0.75rem",
                                      color: "#495057",
                                      fontWeight: 500,
                                      border: "1px solid #e0e0e0"
                                    }}
                                  >
                                    {lab}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span style={{ 
                                color: "#adb5bd", 
                                fontStyle: "italic",
                                fontSize: "0.85rem"
                              }}>
                                No labs assigned
                              </span>
                            )}
                          </td>
                          <td style={{ 
                            padding: "14px 12px",
                            verticalAlign: "middle",
                            border: "none"
                          }}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                              }}
                              style={{
                                padding: "4px 8px",
                                fontSize: "0.7rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                whiteSpace: "nowrap"
                              }}
                            >
                              <FaEdit />
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* --- Pagination Controls (Bottom) --- */}
              {!loadingUsers && totalPages > 1 && (
                <div className="pagination-controls bottom" style={{ padding: "1rem 1.5rem", margin: 0 }}>
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
            </>
          )}
        </Card>

        {/* Registration Modal */}
        <RegisterModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSuccess={fetchUsers}
          labs={labs}
          designations={designations}
          isLoading={isLoading}
        />

        {/* Edit User Modal */}
        <EditUserModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={fetchUsers}
          user={selectedUser}
          labs={labs}
          designations={designations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Register;