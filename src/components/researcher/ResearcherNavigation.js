import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/userSlice';
import { markResearcherNotificationsRead } from '../../store/slices/notificationSlice';
import { markNotificationsRead as markNotificationsReadAPI } from '../../services/AppinfoService';
import useNotificationPolling from '../../hooks/useNotificationPolling';
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaArrowLeft,
  FaHome,
  FaRedo
} from 'react-icons/fa';
import {
  Badge,
} from 'reactstrap';
import Header from '../Lab1/homeLab/Header';
import "../../blast/BlastSidebar.css"

const UserAvatarIcon = FaUserCircle;

const ResearcherNavigation = ({
  userDetails = { name: '', lab: '', designation: '' }, children
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user from Redux for polling
  const reduxUser = useSelector((state) => state.user.user);
  const userId = reduxUser?.id || null;
  
  // Phase 4: Start centralized polling for researcher
  useNotificationPolling({ role: 'researcher', userId });
  
  // Get notification data from Redux (like ManagerNavigation)
  const notifications = useSelector(
    (state) => state.notifications?.researcher?.notifications || []
  );
  const unreadCount = useSelector(
    (state) => state.notifications?.researcher?.unreadCount || 0
  );
  const pendingConfirmations = useSelector(
    (state) => state.notifications?.researcher?.pendingConfirmations || []
  );

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (notificationDropdownOpen && unreadCount > 0) {
      const unreadNotificationIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);
      
      if (unreadNotificationIds.length > 0) {
        // Optimistic update
        dispatch(markResearcherNotificationsRead(unreadNotificationIds));
        
        // Call API to mark as read
        markNotificationsReadAPI(unreadNotificationIds)
          .then(() => {
            console.log('✅ Researcher notifications marked as read');
          })
          .catch((error) => {
            console.error('❌ Error marking researcher notifications as read:', error);
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
      <header className="headerr">
        <Header />
      </header>

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
                  <div className="blast-sidebar-user-lab">
                    {Array.isArray(userDetails.lab) 
                      ? userDetails.lab.join(', ') 
                      : userDetails.lab || 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notification Tab - Above Navigation (like ManagerNavigation) */}
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
                    left: collapsed ? '60px' : '260px', // Position to the right of sidebar
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
                      borderBottom: '1px solid #e2e8f0',
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
                                  {notification.created_at 
                                    ? new Date(notification.created_at).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                      })
                                    : 'Time not available'}
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
                {/* <NavLink
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
                </NavLink> */}
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
                    to="/confirm-issue"
                    className={({ isActive }) =>
                      `blast-sidebar-item ${isActive ? 'active' : ''}`
                    }
                    title="Confirm Items"
                  >
                    <FaBell className="blast-sidebar-item-icon" style={{ color: '#f59e0b' }} />
                    {!collapsed && (
                      <span className="blast-sidebar-item-text">
                        Confirm Items
                        {pendingConfirmations.length > 0 && (
                          <Badge color="danger" pill style={{ marginLeft: '8px', fontSize: '0.7rem' }}>
                            {pendingConfirmations.length}
                          </Badge>
                        )}
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
                  <FaRedo className="blast-sidebar-item-icon" style={{ color: '#8b5cf6' }} />
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

export default ResearcherNavigation;