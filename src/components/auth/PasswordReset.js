import React, { useState, useEffect, useMemo } from "react";
import { updateLoginApi, getAllUsersApi } from "../../services/AppinfoService";
import {
  FaEye,
  FaEyeSlash,
  FaKey,
  FaSearch,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { Modal, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import "./PasswordReset.css";
import { PageLayout, PageHeader } from "../layout/content";

const getRoleBadgeClass = (role) => {
  if (role === "Manager") return "project-badge--role-manager";
  if (role === "Researcher") return "project-badge--success";
  return "project-badge--secondary";
};

function PasswordReset() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsersApi();
        if (mounted) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const usernameMatch = user.username?.toLowerCase().includes(query);
      const nameMatch = user.name?.toLowerCase().includes(query);
      const roleMatch = user.role?.toLowerCase().includes(query);
      const designationMatch = user.designation?.toLowerCase().includes(query);
      const labsMatch = user.lab?.some((lab) =>
        lab.toLowerCase().includes(query)
      );

      return (
        usernameMatch || nameMatch || roleMatch || designationMatch || labsMatch
      );
    });
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleOpenReset = (user) => {
    setSelectedUser(user);
    setPassword("");
    setShowPassword(false);
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
    setSelectedUser(null);
    setPassword("");
    setShowPassword(false);
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    if (!password.trim()) {
      toast.error("Please enter a new password.");
      return;
    }

    setSubmitting(true);
    try {
      await updateLoginApi(selectedUser.username, {
        user_name: selectedUser.username,
        password,
      });
      toast.success("Password reset successfully!");
      handleCloseResetModal();
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader title="Password reset" />

      <div className="password-reset">
        <section className="project-panel" aria-label="User list">
          <div className="project-toolbar">
            <div className="project-toolbar-filter">
              <label htmlFor="password-reset-search" className="project-search-label">
                Search
              </label>
              <div className="project-search">
                <FaSearch className="project-search-icon" aria-hidden />
                <input
                  id="password-reset-search"
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
              {!loading ? (
                <span className="project-toolbar-count" aria-live="polite">
                  <strong>{filteredUsers.length}</strong> user
                  {filteredUsers.length !== 1 ? "s" : ""}
                  {searchTerm ? " matching search" : ""}
                </span>
              ) : null}
            </div>
          </div>

          {loading ? (
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
                      <th scope="col">Username</th>
                      <th scope="col">Name</th>
                      <th scope="col">Role</th>
                      <th scope="col">Designation</th>
                      <th scope="col" className="project-th-actions">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr className="project-table-row project-table-row--empty">
                        <td colSpan="5">
                          <div className="project-empty">
                            <div className="project-empty-icon-wrap">
                              {searchTerm ? (
                                <FaSearch aria-hidden />
                              ) : (
                                <FaUsers aria-hidden />
                              )}
                            </div>
                            <h3>
                              {searchTerm ? "No users found" : "No users available"}
                            </h3>
                            <p>
                              {searchTerm
                                ? "Try adjusting your search."
                                : "No users are registered in the system yet."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr key={user.username} className="project-table-row">
                          <td data-label="Username">
                            <span className="password-reset-username">
                              {user.username || "—"}
                            </span>
                          </td>
                          <td data-label="Name">
                            <span
                              className={
                                user.name ? "project-name" : "password-reset-na"
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
                            {user.designation ? (
                              <span>{user.designation}</span>
                            ) : (
                              <span className="password-reset-na">—</span>
                            )}
                          </td>
                          <td
                            data-label="Actions"
                            className="project-td-actions"
                          >
                            <div className="project-row-actions">
                              <button
                                type="button"
                                className="project-icon-btn project-icon-btn--reset"
                                onClick={() => handleOpenReset(user)}
                                title="Reset password"
                                aria-label={`Reset password for ${user.username}`}
                              >
                                <FaKey aria-hidden />
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
                onPageChange={setCurrentPage}
                position="bottom"
              />
            </div>
          )}
        </section>
      </div>

      <Modal
        show={showResetModal}
        onHide={handleCloseResetModal}
        size="sm"
        scrollable
        centered
        backdrop="static"
        dialogClassName="project-modal"
        contentClassName="project-modal-content"
        aria-labelledby="reset-password-modal-title"
      >
        <div className="project-modal-header">
          <button
            type="button"
            className="project-modal-close"
            onClick={handleCloseResetModal}
            aria-label="Close"
          >
            <FaTimes aria-hidden />
          </button>
          <h2 id="reset-password-modal-title" className="project-modal-title">
            Reset password
          </h2>
          <p className="project-modal-description">
            Set a new password for this user account.
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
            className="project-modal-form"
          >
            {selectedUser ? (
              <div className="project-modal-highlight">
                <div className="project-modal-highlight-row">
                  <span className="project-modal-highlight-label">User</span>
                  <span className="password-reset-username">
                    {selectedUser.username}
                  </span>
                </div>
                {selectedUser.name ? (
                  <div className="project-modal-highlight-row">
                    <span className="project-modal-highlight-label">Name</span>
                    <span>{selectedUser.name}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
            <Form.Group controlId="new-password" className="project-field">
              <Form.Label>New password</Form.Label>
              <div className="project-field-input-wrap">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="project-field-input"
                />
                <button
                  type="button"
                  className="project-field-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEye aria-hidden />
                  ) : (
                    <FaEyeSlash aria-hidden />
                  )}
                </button>
              </div>
            </Form.Group>
            <div className="project-modal-form-actions">
              <button
                type="button"
                className="project-btn project-btn-outline"
                onClick={handleCloseResetModal}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="project-btn project-btn-primary"
                disabled={submitting}
              >
                {submitting ? "Resetting…" : "Reset password"}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </PageLayout>
  );
}

export default PasswordReset;
