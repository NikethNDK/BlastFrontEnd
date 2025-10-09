import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaArrowLeft,
  FaHome,
  FaRedo
} from 'react-icons/fa';
import { 
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Header from '../Lab1/homeLab/Header';
import "../../blast/BlastSidebar.css"
import { BASE_URL } from "../../services/AppinfoService";

const UserAvatarIcon = FaUserCircle;

const ResearcherNavigation = ({ 
  userDetails = { name: '', lab: '', designation: '' }, children
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const fetchDeclinedItems = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/get-issue-items/?status=MGR-DCL`
      );
      const data = await response.json();
      if (data) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching declined items:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchDeclinedItems();
  }, []);

  const cancelNotification = async (entry_no) => {
    console.log("Sending request with entry_no:", entry_no);

    try {
      const payload = {
        id: entry_no,
        status: "RCH-CLSD",
      };

      const response = await fetch(
        `${BASE_URL}/update-issue-items/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        alert("Item has been closed.");
      } else {
        console.error("Failed to close item:", result.error);
      }
    } catch (error) {
      console.error("Error close item:", error);
    }
    fetchDeclinedItems();
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div style={{ backgroundColor: "#f2f5e6" }}>
      <header className="headerr">
        <Header />
      </header>

      <div style={{display: "flex"}}>
        {/* Mobile Overlay */}
        {!collapsed && (
          <div 
            className="blast-sidebar-overlay d-lg-none"
            onClick={() => setCollapsed(true)}
          />
        )}

        {/* Sidebar */}
        <div className={`blast-sidebar ${collapsed ? 'collapsed' : ''}`}>
          
          {/* Header and Toggle */}
          <div className="blast-sidebar-header">
            <div className="d-flex align-items-center justify-content-between w-100">
              {!collapsed && (
                <div className="blast-sidebar-brand">
                  <button 
                    className="blast-sidebar-logo" 
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <FaArrowLeft />
                  </button>
                  <span>Researcher</span>
                </div>
              )}
            </div>
          </div>

          {/* User Info Section */}
          <div className="blast-sidebar-top-meta">
            {!collapsed && (
              <div className="blast-sidebar-user">
                <div className="blast-sidebar-user-avatar">
                  <UserAvatarIcon />
                </div>
                <div className="blast-sidebar-user-info">
                  <div className="blast-sidebar-user-name">{userDetails.name}</div>
                  <div className="blast-sidebar-user-role">{userDetails.designation}</div>
                  <div className="blast-sidebar-user-lab">{userDetails.lab}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Menu (Navigation) */}
          <div className="blast-sidebar-menu-wrapper">
            <div className="blast-sidebar-section">
              {!collapsed && <div className="blast-sidebar-section-title">Navigation</div>}
              
              {/* Notification Dropdown */}
              {!collapsed && (
                <div style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle 
                      tag="div" 
                      className="position-relative d-flex align-items-center gap-2"
                      style={{ cursor: 'pointer' }}
                    >
                      <FaBell size={20} style={{ color: 'yellowgreen' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Notifications</span>
                      <i className="fa fa-caret-down" style={{ marginLeft: 'auto' }} />
                      {notifications.length > 0 && (
                        <Badge
                          color="danger"
                          pill
                          className="position-absolute"
                          style={{ top: '-5px', right: '10px', fontSize: '0.7rem' }}
                        >
                          {notifications.length}
                        </Badge>
                      )}
                    </DropdownToggle>

                    <DropdownMenu
                      style={{
                        width: "280px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        marginTop: '0.5rem'
                      }}
                    >
                      {notifications.length === 0 ? (
                        <DropdownItem disabled>
                          No new notifications
                        </DropdownItem>
                      ) : (
                        notifications.map((notif, index) => (
                          <DropdownItem
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: 'center',
                              padding: "0.75rem",
                              borderBottom: index < notifications.length - 1 ? '1px solid #e2e8f0' : 'none'
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <strong style={{ fontSize: '0.9rem' }}>{notif.item_name}</strong>
                            </div>
                            <button
                              onClick={() => cancelNotification(notif.entry_no)}
                              style={{
                                border: "none",
                                background: 'transparent',
                                cursor: "pointer",
                                fontSize: "1.2rem",
                                padding: '0.25rem'
                              }}
                            >
                              ❌
                            </button>
                          </DropdownItem>
                        ))
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}

              <nav className="blast-sidebar-menu">
                <NavLink
                  to="/re_notify"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Notification"
                >
                  <FaBell className="blast-sidebar-item-icon" style={{ color: '#ef4444' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Notification</span>
                  )}
                </NavLink>

                <NavLink
                  to="/addProductReq"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Request"
                >
                  <FaRedo className="blast-sidebar-item-icon" style={{ color: '#3b82f6' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Request</span>
                  )}
                </NavLink>

                <NavLink
                  to="/change_password"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Change Password"
                >
                  <FaRedo className="blast-sidebar-item-icon" style={{ color: '#8b5cf6' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Change Password</span>
                  )}
                </NavLink>

                <NavLink
                  to="/masters"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Inventory View"
                >
                  <FaHome className="blast-sidebar-item-icon" style={{ color: '#10b981' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Inventory View</span>
                  )}
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Footer - Logout Button */}
          <div className="blast-sidebar-footer">
            <button 
              className="blast-sidebar-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
        </div>
      </div>
    </div>
  );
};

export default ResearcherNavigation;