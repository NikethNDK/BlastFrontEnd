import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaPlus, 
  FaUpload, 
  FaDownload, 
  FaDatabase, 
  FaUndo, 
  FaFileAlt, 
  FaCog, 
  FaBell, 
  FaBars,
  FaTimes,
  FaDna,
  FaFlask,
  FaMicroscope,
  FaChartBar,
  FaUserCircle, // Changed FaUser to FaUserCircle for a better avatar look
  FaSignOutAlt,
  FaArrowLeft
} from 'react-icons/fa';
import { Badge, Dropdown } from 'react-bootstrap';
import './ModernSidebar.css';

// Using FaUserCircle instead of FaUser for avatar
const UserAvatarIcon = FaUserCircle; 

const ModernSidebar = ({ 
  userDetails = { name: 'User Name', lab: 'Lab Assistant', designation: 'Researcher' },
  notifications = [],
  onNotificationClick,
  onLogout
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate()

  // Grouping menu items logically for a better UI structure
  const menuSections = [
    {
      title: 'Inventory Management',
      items: [
        { path: '/master', icon: FaHome, label: 'Inventory View', color: 'primary' },
        { path: '/received_product', icon: FaUpload, label: 'Add Received Item', color: 'success' },
        { path: '/issued_product', icon: FaDownload, label: 'Add Issued Item', color: 'danger' },
        { path: '/transferred', icon: FaUndo, label: 'Add Returned Item', color: 'warning' },
      ]
    },
    {
      title: 'Data & Reports',
      items: [
        { path: '/returntable', icon: FaDatabase, label: 'Received Data', color: 'info' },
        { path: '/issuetable', icon: FaFileAlt, label: 'Issued Data', color: 'info' },
        { path: '/retrun', icon: FaUndo, label: 'Return Data', color: 'info' },
        { path: '/add_product', icon: FaPlus, label: 'Add New Data', color: 'info' },
      ]
    },
    {
      title: 'Specialized Tools',
      items: [
        // { path: '/dna', icon: FaDna, label: 'DNA Repository', color: 'secondary' },
        // { path: '/add_blast', icon: FaFlask, label: 'DNA Blast', color: 'secondary' },
        { path: '/equipment', icon: FaMicroscope, label: 'Equipment List', color: 'secondary' },
      ]
    }
  ];
  
  // Flatten all items for mapping
  const allMenuItems = menuSections.flatMap(section => section.items);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    // Optionally close the dropdown after clicking a notification
    setShowNotifications(false); 
  };

  // The component render
  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="modern-sidebar-overlay d-lg-none"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`modern-sidebar ${collapsed ? 'collapsed' : ''}`}>
        
        {/* Header and Toggle */}
        <div className="modern-sidebar-header">
          <div className="d-flex align-items-center justify-content-between">
            {!collapsed && (
              <div className="modern-sidebar-brand">
                <button className="modern-sidebar-logo" onClick={() => navigate("/")}>
                  <FaArrowLeft />
                </button>
                <span>Lab Management</span>
              </div>
            )}
            <button 
              className="modern-sidebar-toggle"
              onClick={toggleSidebar}
            >
              {collapsed ? <FaBars /> : <FaTimes />}
            </button>
          </div>
        </div>

        {/* Top Section: User & Notifications */}
        <div className="modern-sidebar-top-meta">
          {/* User Info */}
          {!collapsed && (
            <div className="modern-sidebar-user">
              <div className="modern-sidebar-user-avatar">
                <UserAvatarIcon />
              </div>
              <div className="modern-sidebar-user-info">
                <div className="modern-sidebar-user-name">{userDetails.name}</div>
                <div className="modern-sidebar-user-role">{userDetails.designation}</div>
                <div className="modern-sidebar-user-lab">{userDetails.lab}</div>
              </div>
            </div>
          )}

          {/* Notifications Toggle */}
          <div className="modern-sidebar-notifications">
            <Dropdown show={showNotifications} onToggle={setShowNotifications} align="end">
              <Dropdown.Toggle as="div" className="modern-notification-toggle">
                <div className="modern-notification-bell">
                  <FaBell />
                  {notifications.length > 0 && (
                    <Badge className="modern-notification-badge">
                      {notifications.length}
                    </Badge>
                  )}
                </div>
                {!collapsed && <span>Notifications</span>}
              </Dropdown.Toggle>
              <Dropdown.Menu className="modern-notification-menu">
                <Dropdown.Header>Notifications ({notifications.length})</Dropdown.Header>
                <div className="modern-notification-list-scroll">
                  {notifications.length === 0 ? (
                    <Dropdown.Item disabled className="text-center text-muted">
                      All clear!
                    </Dropdown.Item>
                  ) : (
                    notifications.map((notification, index) => (
                      <Dropdown.Item
                        key={index} // Using index as key since no id was specified in example
                        onClick={() => handleNotificationClick(notification)}
                        className="modern-notification-item"
                      >
                        <div className="modern-notification-content">
                          <div className="modern-notification-title">
                            {notification.item_name}
                          </div>
                          <div className="modern-notification-meta">
                            {notification.status}
                          </div>
                        </div>
                        <button
                          className="modern-notification-close"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification); // Assumes clicking close marks as read
                          }}
                        >
                          <FaTimes />
                        </button>
                      </Dropdown.Item>
                    ))
                  )}
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        
        {/* Menu (Navigation) */}
        <div className="modern-sidebar-menu-wrapper">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="modern-sidebar-section">
              {!collapsed && <div className="modern-sidebar-section-title">{section.title}</div>}
              <nav className="modern-sidebar-menu">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => 
                        `modern-sidebar-item ${isActive ? 'active' : ''}`
                      }
                      title={item.label}
                    >
                      <Icon className={`modern-sidebar-item-icon color-${item.color}`} />
                      {!collapsed && (
                        <span className="modern-sidebar-item-text">{item.label}</span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Settings and Logout are separate for a clean look */}
          <div className="modern-sidebar-section">
             {!collapsed && <div className="modern-sidebar-section-title">Account</div>}
             <nav className="modern-sidebar-menu">
                <NavLink
                  to="/change_password"
                  className={({ isActive }) => 
                    `modern-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Change Password"
                >
                  <FaCog className="modern-sidebar-item-icon color-neutral" />
                  {!collapsed && (
                    <span className="modern-sidebar-item-text">Change Password</span>
                  )}
                </NavLink>
             </nav>
          </div>

        </div>

        {/* Footer */}
        <div className="modern-sidebar-footer">
          <button 
            className="modern-sidebar-logout"
            onClick={onLogout}
            title="Logout"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default ModernSidebar;