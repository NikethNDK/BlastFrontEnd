import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import { markLabAssistantNotificationsRead } from '../../store/slices/notificationSlice';
import { markNotificationsRead as markNotificationsReadAPI } from '../../services/AppinfoService';
import useNotificationPolling from '../../hooks/useNotificationPolling';
import './ModernSidebar.css';

// Using FaUserCircle instead of FaUser for avatar
const UserAvatarIcon = FaUserCircle; 

const ModernSidebar = ({ 
  userDetails = { name: 'User Name', lab: 'Lab Assistant', designation: 'Researcher' },
  userId,
  onLogout
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Start notification polling for lab assistant role
  useNotificationPolling({ role: 'lab_assistant', userId });

  // Get notification data from Redux
  const notifications = useSelector(
    (state) => state.notifications?.labAssistant?.notifications || []
  );
  const unreadCount = useSelector(
    (state) => state.notifications?.labAssistant?.unreadCount || 0
  );

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (notificationDropdownOpen && unreadCount > 0) {
      const unreadNotificationIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);
      
      if (unreadNotificationIds.length > 0) {
        // Optimistic update
        dispatch(markLabAssistantNotificationsRead(unreadNotificationIds));
        
        // Call API to mark as read
        markNotificationsReadAPI(unreadNotificationIds)
          .then(() => {
            console.log('✅ Lab assistant notifications marked as read');
          })
          .catch((error) => {
            console.error('❌ Error marking notifications as read:', error);
          });
      }
    }
  }, [notificationDropdownOpen, unreadCount, notifications, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    if (notificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationDropdownOpen]);

  // Helper function to format relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      // Show full date and time for older notifications
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error parsing date:', dateString, e);
      return 'Invalid date';
    }
  };

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
    // {
    //    title: 'Specialized Tools',
    //    items: [
    //     { path: '/dna', icon: FaDna, label: 'DNA Repository', color: 'secondary' },
    //     { path: '/add_blast', icon: FaFlask, label: 'DNA Blast', color: 'secondary' },
    //      { path: '/equipment', icon: FaMicroscope, label: 'Equipment List', color: 'secondary' },
    //    ]
    //  }
  ];
  
  // Flatten all items for mapping
  const allMenuItems = menuSections.flatMap(section => section.items);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
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
      <div className={`modern-sidebar ${collapsed ? 'collapsed' : ''}`} ref={sidebarRef}>
        
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
          <div style={{ position: 'relative', marginTop: '12px' }}>
            <button
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: notificationDropdownOpen ? '#3b82f6' : 'transparent',
                color: notificationDropdownOpen ? '#ffffff' : '#64748b',
                border: '1px solid',
                borderColor: notificationDropdownOpen ? '#3b82f6' : '#e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!notificationDropdownOpen) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }
              }}
              onMouseLeave={(e) => {
                if (!notificationDropdownOpen) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              title="Notifications"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBell />
                {!collapsed && <span>Notifications</span>}
              </div>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: notificationDropdownOpen ? '#ffffff' : '#ef4444',
                    color: notificationDropdownOpen ? '#3b82f6' : '#ffffff',
                    borderRadius: '12px',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '0 6px',
                  }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown - Positioned to the right of sidebar */}
            {notificationDropdownOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: '250px',
                  left: collapsed ? '60px' : '260px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  minWidth: '320px',
                  maxWidth: '400px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  zIndex: 10000,
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgb(69, 74, 80)',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#1e293b',
                    backgroundColor: '#f8fafc',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                </div>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '14px',
                    }}
                  >
                    No notifications
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          backgroundColor: notification.is_read ? '#ffffff' : '#f8fafc',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = notification.is_read ? '#ffffff' : '#f8fafc';
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                          }}
                        >
                          {!notification.is_read && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#3b82f6',
                                marginTop: '6px',
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: '13px',
                                color: '#1e293b',
                                marginBottom: '4px',
                                lineHeight: '1.4',
                              }}
                            >
                              {notification.message}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <span>{notification.notification_type}</span>
                              <span>•</span>
                              <span>{getRelativeTime(notification.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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