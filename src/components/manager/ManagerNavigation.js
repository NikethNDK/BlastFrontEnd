import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FaSignOutAlt,
  FaChartBar,
  FaBell,
  FaRedo,
  FaSyncAlt,
  FaUserTie,
  FaHome,
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import "../../blast/BlastSidebar.css";
import Header from "../Lab1/homeLab/Header";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../../store/slices/userSlice';
import { markNotificationsRead } from '../../store/slices/notificationSlice';
import { markNotificationsRead as markNotificationsReadAPI } from '../../services/AppinfoService';
import useNotificationPolling from '../../hooks/useNotificationPolling';

const ManagerNavigation = ({
  children,
  userId,
  userDetails = { name: "", lab: "", designation: "" }
}) => {
  // Start notification polling for manager role
  useNotificationPolling({ role: 'manager', userId });
  const [collapsed, setCollapsed] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get notification data from Redux
  const notifications = useSelector(
    (state) => state.notifications?.manager?.notifications || []
  );
  const unreadCount = useSelector(
    (state) => state.notifications?.manager?.unreadCount || 0
  );
  const pendingIssuesCount = useSelector(
    (state) => state.notifications?.manager?.pendingIssues?.length || 0
  );
  const pendingReturnsCount = useSelector(
    (state) => state.notifications?.manager?.pendingReturns?.length || 0
  );

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (notificationDropdownOpen && unreadCount > 0) {
      const unreadNotificationIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);
      
      if (unreadNotificationIds.length > 0) {
        // Optimistic update
        dispatch(markNotificationsRead(unreadNotificationIds));
        
        // Call API to mark as read
        markNotificationsReadAPI(unreadNotificationIds)
          .then(() => {
            console.log('✅ Notifications marked as read');
          })
          .catch((error) => {
            console.error('❌ Error marking notifications as read:', error);
            // Could revert optimistic update here if needed
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
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Logout failed:', err);
        navigate('/');
      });
  };

  return (
    <div style={{ backgroundColor: "#f2f5e6" }}>
      {/* <header className="headerr"> */}
      <Header />
      {/* </header> */}

      <div style={{ display: "flex" }}>
        {/* Mobile Overlay */}
        {!collapsed && (
          <div
            className="blast-sidebar-overlay d-lg-none"
            onClick={() => setCollapsed(true)}
          />
        )}

        {/* Sidebar */}
        <div className={`blast-sidebar ${collapsed ? 'collapsed' : ''}`} ref={sidebarRef}>

          {/* Header and Toggle */}
          <div className="blast-sidebar-header">
            <div className="d-flex align-items-center justify-content-between w-100">
              {!collapsed && (
                <div className="blast-sidebar-brand">
                  <button className="modern-sidebar-logo" onClick={() => navigate("/")}>
                    <FaHome />
                  </button>
                  <span>Manager</span>
                </div>
              )}
            </div>
          </div>

          {/* Notification Tab - Above Navigation */}
          {!collapsed && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                style={{
                  width: 'calc(100% - 16px)',
                  padding: '12px 16px',
                  margin: '8px',
                  backgroundColor: notificationDropdownOpen ? '#3b82f6' : '#f8fafc',
                  color: notificationDropdownOpen ? '#ffffff' : '#1e293b',
                  border: '1px solid',
                  borderColor: notificationDropdownOpen ? '#3b82f6' : '#e2e8f0',
                  borderRadius: '8px',
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
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }
                }}
                title="Notifications"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaBell />
                  <span>Notifications</span>
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
                    top: '250px', // Adjust based on header height
                    left: collapsed ? '60px' : '260px', // Position to the right of sidebar (adjust based on sidebar width)
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
                      borderBottom: '1px solidrgb(69, 74, 80)',
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
                                <span>
                                  {new Date(notification.created_at).toLocaleString()}
                                </span>
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
          )}

          {/* Menu (Navigation) */}
          <div className="blast-sidebar-menu-wrapper">
            <div className="blast-sidebar-section">
              {!collapsed && <div className="blast-sidebar-section-title">Navigation</div>}

              <nav className="blast-sidebar-menu">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Dashboard"
                >
                  <FaChartBar className="blast-sidebar-item-icon" style={{ color: '#3b82f6' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Dashboard</span>
                  )}
                </NavLink>

                <NavLink
                  to="/notification"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Request Notification"
                  style={{ position: 'relative' }}
                >
                  <FaBell className="blast-sidebar-item-icon" style={{ color: '#f59e0b' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Request Notification</span>
                  )}
                  {pendingIssuesCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        borderRadius: '50%',
                        minWidth: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '0 6px',
                        zIndex: 1000,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        border: '2px solid #ffffff',
                      }}
                    >
                      {pendingIssuesCount > 99 ? '99+' : pendingIssuesCount}
                    </span>
                  )}
                </NavLink>
                
                <NavLink
                  to="/returnNoti"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Return Notification"
                  style={{ position: 'relative' }}
                >
                  <FaSyncAlt className="blast-sidebar-item-icon" style={{ color: '#06b6d4' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Return Notification</span>
                  )}
                  {pendingReturnsCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        borderRadius: '50%',
                        minWidth: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '0 6px',
                        zIndex: 1000,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        border: '2px solid #ffffff',
                      }}
                    >
                      {pendingReturnsCount > 99 ? '99+' : pendingReturnsCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/change_password"
                  className={({ isActive }) =>
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Change Password"
                >
                  <FaRedo className="blast-sidebar-item-icon" style={{ color: '#ef4444' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Change Password</span>
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

export default ManagerNavigation;