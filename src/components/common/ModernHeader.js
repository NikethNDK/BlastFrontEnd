import React from 'react';
import { FaBars, FaBell, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import './ModernHeader.css';

const ModernHeader = ({ 
  title = 'Lab Assistant Dashboard',
  subtitle = 'Manage your laboratory inventory efficiently',
  userDetails = { name: '', lab: '', designation: '' },
  notifications = [],
  onToggleSidebar,
  onNotificationClick,
  onLogout
}) => {
  return (
    <div className="lab-header">
      <div className="lab-header-content">
        {/* Left Section */}
        <div className="lab-header-left">
          <button 
            className="lab-header-toggle d-lg-none"
            onClick={onToggleSidebar}
          >
            <FaBars />
          </button>
          <div className="lab-header-title-section">
            <h1 className="lab-header-title">{title}</h1>
            <p className="lab-header-subtitle">{subtitle}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="lab-header-right">
          {/* Notifications */}
          <Dropdown>
            <Dropdown.Toggle as="div" className="lab-header-notification">
              <div className="lab-header-notification-bell">
                <FaBell />
                {notifications.length > 0 && (
                  <span className="lab-header-notification-badge">
                    {notifications.length}
                  </span>
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="lab-header-notification-menu">
              <Dropdown.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Notifications</span>
                  <span className="badge bg-primary">{notifications.length}</span>
                </div>
              </Dropdown.Header>
              {notifications.length === 0 ? (
                <Dropdown.Item disabled>
                  <div className="text-center py-3">
                    <FaBell className="text-muted mb-2" size={24} />
                    <p className="text-muted mb-0">No new notifications</p>
                  </div>
                </Dropdown.Item>
              ) : (
                notifications.map((notification) => (
                  <Dropdown.Item
                    key={notification.id}
                    onClick={() => onNotificationClick && onNotificationClick(notification)}
                    className="lab-header-notification-item"
                  >
                    <div className="lab-header-notification-content">
                      <div className="lab-header-notification-title">
                        {notification.item_name}
                      </div>
                      <div className="lab-header-notification-meta">
                        {notification.status}
                      </div>
                    </div>
                  </Dropdown.Item>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* User Menu */}
          <Dropdown>
            <Dropdown.Toggle as="div" className="lab-header-user">
              <div className="lab-header-user-avatar">
                <FaUser />
              </div>
              <div className="lab-header-user-info d-none d-md-block">
                <div className="lab-header-user-name">{userDetails.name}</div>
                <div className="lab-header-user-role">{userDetails.designation}</div>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="lab-header-user-menu">
              <Dropdown.Header>
                <div className="lab-header-user-menu-header">
                  <div className="lab-header-user-menu-avatar">
                    <FaUser />
                  </div>
                  <div>
                    <div className="lab-header-user-menu-name">{userDetails.name}</div>
                    <div className="lab-header-user-menu-role">{userDetails.designation}</div>
                    <div className="lab-header-user-menu-lab">{userDetails.lab}</div>
                  </div>
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item>
                <FaCog className="me-2" />
                Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={onLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default ModernHeader;
