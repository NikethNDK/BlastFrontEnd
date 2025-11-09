import React, { useState, useEffect, useMemo } from "react";
import {
  addLoginApi,
  getLabsApi,
  getDesignationsApi,
  getAllUsersApi,
} from "../../services/AppinfoService";
import { FaEye, FaEyeSlash, FaUserPlus, FaUser, FaLock, FaBriefcase, FaFlask, FaSearch } from "react-icons/fa";
import { Table, Modal, Button, Form, InputGroup, Card, Badge } from "react-bootstrap";
import Select from "react-select";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
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

    const selectedLabIds = selectedLabs.map((lab) => lab.value);

    if (isNaN(parseInt(designation, 10))) {
      toast.error("Please select a valid designation.");
      return;
    }

    const requestData = {
      user_name: username,
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
                isMulti
                styles={customSelectStyles}
                value={selectedLabs}
                onChange={(selectedOptions) => setSelectedLabs(selectedOptions || [])}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select labs..."
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

function Register({ userDetails = { name: "", lab: "", designation: "" } }) {
  // Form states for labs and designations
  const [designations, setDesignations] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Table and modal states
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Filter users based on search term (client-side)
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const searchLower = searchTerm.toLowerCase();
    return users.filter((user) => {
      const usernameMatch = user.username?.toLowerCase().includes(searchLower);
      const roleMatch = user.role?.toLowerCase().includes(searchLower);
      const designationMatch = user.designation?.toLowerCase().includes(searchLower);
      const labsMatch = user.lab?.some((lab) => lab.toLowerCase().includes(searchLower));
      
      return usernameMatch || roleMatch || designationMatch || labsMatch;
    });
  }, [users, searchTerm]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

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
                placeholder="Search by username, role, designation, or lab..."
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
              <div style={{ overflowX: "auto" }}>
                <Table 
                  hover 
                  style={{ 
                    marginBottom: 0,
                    fontSize: "0.875rem"
                  }}
                >
                  <thead>
                    <tr style={{ 
                      backgroundColor: "#f8f9fa",
                      borderBottom: "2px solid #dee2e6"
                    }}>
                      <th style={{ 
                        padding: "14px 16px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none"
                      }}>
                        Username
                      </th>
                      <th style={{ 
                        padding: "14px 16px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none"
                      }}>
                        Role
                      </th>
                      <th style={{ 
                        padding: "14px 16px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none"
                      }}>
                        Designation
                      </th>
                      <th style={{ 
                        padding: "14px 16px", 
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#495057",
                        border: "none"
                      }}>
                        Labs
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td 
                          colSpan="4" 
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
                            padding: "14px 16px",
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
                                fontWeight: 600
                              }}>
                                {user.username?.charAt(0).toUpperCase() || "U"}
                              </div>
                              {user.username || "N/A"}
                            </div>
                          </td>
                          <td style={{ 
                            padding: "14px 16px",
                            verticalAlign: "middle",
                            border: "none"
                          }}>
                            <Badge 
                              bg="primary" 
                              style={{ 
                                padding: "6px 12px",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                borderRadius: "6px"
                              }}
                            >
                              {user.role || "N/A"}
                            </Badge>
                          </td>
                          <td style={{ 
                            padding: "14px 16px",
                            verticalAlign: "middle",
                            color: "#495057",
                            border: "none"
                          }}>
                            {user.designation || "N/A"}
                          </td>
                          <td style={{ 
                            padding: "14px 16px",
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
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination Footer */}
              {!loadingUsers && totalPages > 1 && (
                <div style={{ 
                  padding: "16px 20px",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  backgroundColor: "#f8f9fa",
                  borderTop: "1px solid #dee2e6"
                }}>
                  <div style={{ 
                    color: "#6c757d", 
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}>
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} entries
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
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
      </div>
    </div>
  );
}

export default Register;