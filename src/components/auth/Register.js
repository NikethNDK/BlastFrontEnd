import React, { useState, useEffect, useMemo } from "react";
import {
  addLoginApi,
  getLabsApi,
  getDesignationsApi,
  getAllUsersApi,
  updateLoginApi,
} from "../../services/AppinfoService";
import {
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaUser,
  FaSearch,
  FaEdit,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { Modal, Form } from "react-bootstrap";
import Select from "react-select";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import "./Register.css";
import { PageLayout, PageHeader } from "../layout/content";

const getRoleBadgeClass = (role) => {
  if (role === "Manager") return "project-badge--role-manager";
  if (role === "Researcher") return "project-badge--success";
  return "project-badge--secondary";
};

const REGISTER_SELECT_STYLES = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.25rem",
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#b5da21" : "#e2e8f0",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(197, 234, 49, 0.2)"
      : "0 1px 2px rgba(0, 0, 0, 0.05)",
    fontSize: "0.875rem",
    "&:hover": {
      borderColor: "#b5da21",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fff",
    fontSize: "0.875rem",
    zIndex: 10000,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 10000,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? "#c5ea31" : isFocused ? "#f3fae8" : "#fff",
    color: "#1a3d2a",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f3fae8",
    borderRadius: "4px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#1a3d2a",
    fontSize: "0.8125rem",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#1a3d2a",
    "&:hover": {
      backgroundColor: "#c5ea31",
      color: "#1a3d2a",
    },
  }),
};

const UserFormFields = ({
  username,
  setUsername,
  name,
  setName,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  role,
  setRole,
  designation,
  setDesignation,
  selectedLabs,
  setSelectedLabs,
  labs,
  designations,
  isLoading,
  includePassword = false,
  idPrefix = "user",
}) => {
  const handleLabsChange = (selectedOptions) => {
    if (role === "Lab Assistant") {
      setSelectedLabs(selectedOptions ? [selectedOptions] : []);
    } else {
      setSelectedLabs(selectedOptions || []);
    }
  };

  return (
    <>
      <Form.Group controlId={`${idPrefix}-username`} className="project-field">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
          autoComplete="off"
          className="project-field-input"
        />
      </Form.Group>

      <Form.Group controlId={`${idPrefix}-name`} className="project-field">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          autoComplete="off"
          className="project-field-input"
        />
      </Form.Group>

      {includePassword ? (
        <Form.Group controlId={`${idPrefix}-password`} className="project-field">
          <Form.Label>Password</Form.Label>
          <div className="project-field-input-wrap">
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="new-password"
              className="project-field-input"
            />
            <button
              type="button"
              className="project-field-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEye aria-hidden /> : <FaEyeSlash aria-hidden />}
            </button>
          </div>
        </Form.Group>
      ) : null}

      <Form.Group controlId={`${idPrefix}-role`} className="project-field">
        <Form.Label>Role</Form.Label>
        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="project-field-input"
          required
        >
          <option value="">Select role</option>
          <option value="Manager">Manager</option>
          <option value="Lab Assistant">Lab Assistant</option>
          <option value="Researcher">Researcher</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId={`${idPrefix}-designation`} className="project-field">
        <Form.Label>Designation</Form.Label>
        <Form.Select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="project-field-input"
          required
        >
          <option value="">Select designation</option>
          {isLoading ? (
            <option disabled>Loading…</option>
          ) : (
            designations.map((des) => (
              <option key={des.id} value={des.id}>
                {des.title}
              </option>
            ))
          )}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId={`${idPrefix}-labs`} className="project-field">
        <Form.Label>Labs</Form.Label>
        <Select
          options={labs}
          isMulti={role !== "Lab Assistant"}
          styles={REGISTER_SELECT_STYLES}
          value={selectedLabs}
          onChange={handleLabsChange}
          className="register-modal-select"
          classNamePrefix="register-select"
          placeholder={
            role === "Lab Assistant" ? "Select lab…" : "Select labs…"
          }
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
      </Form.Group>
    </>
  );
};

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

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
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
    <Modal
      show={show}
      onHide={handleClose}
      size="sm"
      scrollable
      centered
      backdrop="static"
      dialogClassName="project-modal project-modal--form"
      contentClassName="project-modal-content"
      aria-labelledby="register-user-modal-title"
    >
      <div className="project-modal-header">
        <button
          type="button"
          className="project-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes aria-hidden />
        </button>
        <h2 id="register-user-modal-title" className="project-modal-title">
          Add user
        </h2>
        <p className="project-modal-description">
          Create a new user account with role, designation, and lab access.
        </p>
      </div>
      <Modal.Body className="project-modal-body">
        <Form onSubmit={handleRegister} className="project-modal-form">
          <UserFormFields
            idPrefix="register"
            username={username}
            setUsername={setUsername}
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            role={role}
            setRole={setRole}
            designation={designation}
            setDesignation={setDesignation}
            selectedLabs={selectedLabs}
            setSelectedLabs={setSelectedLabs}
            labs={labs}
            designations={designations}
            isLoading={isLoading}
            includePassword
          />
          <div className="project-modal-form-actions">
            <button
              type="button"
              className="project-btn project-btn-outline"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="project-btn project-btn-primary">
              Create user
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
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

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
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
    <Modal
      show={show}
      onHide={handleClose}
      size="sm"
      scrollable
      centered
      backdrop="static"
      dialogClassName="project-modal project-modal--form"
      contentClassName="project-modal-content"
      aria-labelledby="edit-user-modal-title"
    >
      <div className="project-modal-header">
        <button
          type="button"
          className="project-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes aria-hidden />
        </button>
        <h2 id="edit-user-modal-title" className="project-modal-title">
          Edit user
        </h2>
        <p className="project-modal-description">
          Update account details, role, designation, and lab assignments.
        </p>
      </div>
      <Modal.Body className="project-modal-body">
        <Form onSubmit={handleUpdate} className="project-modal-form">
          <UserFormFields
            idPrefix="edit"
            username={username}
            setUsername={setUsername}
            name={name}
            setName={setName}
            role={role}
            setRole={setRole}
            designation={designation}
            setDesignation={setDesignation}
            selectedLabs={selectedLabs}
            setSelectedLabs={setSelectedLabs}
            labs={labs}
            designations={designations}
            isLoading={isLoading}
          />
          <div className="project-modal-form-actions">
            <button
              type="button"
              className="project-btn project-btn-outline"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="project-btn project-btn-primary">
              Save changes
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
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

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
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
        title="User management"
        actions={
          <button
            type="button"
            className="lims-header-btn"
            onClick={() => setShowModal(true)}
          >
            <FaUserPlus aria-hidden />
            Add user
          </button>
        }
      />

      <div className="register-users">
        <section className="project-panel" aria-label="User list">
          <div className="project-toolbar">
            <div className="project-toolbar-filter">
              <label htmlFor="register-search" className="project-search-label">
                Search
              </label>
              <div className="project-search">
                <FaSearch className="project-search-icon" aria-hidden />
                <input
                  id="register-search"
                  type="search"
                  placeholder="Filter by username, name, role, designation, or lab…"
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
              {!loadingUsers ? (
                <span className="project-toolbar-count" aria-live="polite">
                  <strong>{filteredUsers.length}</strong> user
                  {filteredUsers.length !== 1 ? "s" : ""}
                  {searchTerm ? " matching search" : ""}
                </span>
              ) : null}
            </div>
            <div className="project-toolbar-actions">
              <button
                type="button"
                className="project-btn project-btn-ghost"
                onClick={() => handleSort("name")}
              >
                {renderSortIcon("name")}
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

          {loadingUsers ? (
            <div className="project-loading" role="status" aria-live="polite">
              <div className="project-spinner" />
              <span>Loading users…</span>
            </div>
          ) : (
            <div className="project-table-section">
              <div className="project-table-shell">
                <table className="project-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <button
                          type="button"
                          className="project-th-sort"
                          onClick={() => handleSort("username")}
                        >
                          Username
                          {renderSortIcon("username")}
                        </button>
                      </th>
                      <th scope="col">
                        <button
                          type="button"
                          className="project-th-sort"
                          onClick={() => handleSort("name")}
                        >
                          Name
                          {renderSortIcon("name")}
                        </button>
                      </th>
                      <th scope="col">Role</th>
                      <th scope="col">Designation</th>
                      <th scope="col">Labs</th>
                      <th scope="col" className="project-th-actions">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr className="project-table-row project-table-row--empty">
                        <td colSpan="6">
                          <div className="project-empty">
                            <div className="project-empty-icon-wrap">
                              {searchTerm ? (
                                <FaSearch aria-hidden />
                              ) : (
                                <FaUser aria-hidden />
                              )}
                            </div>
                            <h3>
                              {searchTerm
                                ? "No users found"
                                : "No users available"}
                            </h3>
                            <p>
                              {searchTerm
                                ? "Try adjusting your search or clear filters."
                                : 'Click "Add user" to create your first user.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr key={user.username} className="project-table-row">
                          <td data-label="Username">
                            <span className="project-name register-username">
                              {user.username || "—"}
                            </span>
                          </td>
                          <td data-label="Name">
                            <span
                              className={
                                user.name ? "project-name" : "register-na"
                              }
                            >
                              {user.name || "N/A"}
                            </span>
                          </td>
                          <td data-label="Role">
                            <span
                              className={`project-badge ${getRoleBadgeClass(
                                user.role
                              )}`}
                            >
                              {user.role || "N/A"}
                            </span>
                          </td>
                          <td data-label="Designation">
                            <span className="register-designation">
                              {user.designation || "—"}
                            </span>
                          </td>
                          <td data-label="Labs">
                            {user.lab && user.lab.length > 0 ? (
                              <div className="register-lab-tags">
                                {user.lab.map((lab) => (
                                  <span
                                    key={`${user.username}-${lab}`}
                                    className="project-badge project-badge--secondary"
                                  >
                                    {lab}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="register-na">No labs assigned</span>
                            )}
                          </td>
                          <td
                            data-label="Actions"
                            className="project-td-actions"
                          >
                            <div className="project-row-actions">
                              <button
                                type="button"
                                className="project-icon-btn project-icon-btn--edit"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowEditModal(true);
                                }}
                                title="Edit user"
                                aria-label={`Edit ${user.username}`}
                              >
                                <FaEdit aria-hidden />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                showItemsPerPage
                showSummary
                totalItems={filteredUsers.length}
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
          )}
        </section>
      </div>

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
    </PageLayout>
  );
}

export default Register;