import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaHome,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import {
  markNotificationsRead,
  markLabAssistantNotificationsRead,
  markResearcherNotificationsRead,
} from '../../store/slices/notificationSlice';
import { markNotificationsRead as markNotificationsReadAPI } from '../../services/AppinfoService';
import { logoutUser } from '../../store/slices/userSlice';
import useNotificationPolling from '../../hooks/useNotificationPolling';
import NotificationPanel from '../common/NotificationPanel';

const UserAvatarIcon = FaUserCircle;

const NOTIFICATION_STATE_KEYS = {
  manager: 'manager',
  lab_assistant: 'labAssistant',
  researcher: 'researcher',
};

const MARK_READ_ACTIONS = {
  manager: markNotificationsRead,
  lab_assistant: markLabAssistantNotificationsRead,
  researcher: markResearcherNotificationsRead,
};

function formatLabDisplay(lab) {
  if (Array.isArray(lab)) {
    return lab.join(', ') || 'N/A';
  }
  return lab || 'N/A';
}

function NavItem({ item, collapsed, badgeCount }) {
  const Icon = item.icon;
  const iconProps = item.iconColorClass
    ? { className: `app-sidebar-item-icon ${item.iconColorClass}` }
    : { className: 'app-sidebar-item-icon', style: item.iconColor ? { color: item.iconColor } : undefined };

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `app-sidebar-item${isActive ? ' active' : ''}`}
      title={item.label}
    >
      <Icon {...iconProps} />
      {!collapsed && <span className="app-sidebar-item-text">{item.label}</span>}
      {badgeCount > 0 && (
        <span className="app-sidebar-item-badge" aria-label={`${badgeCount} pending`}>
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </NavLink>
  );
}

function MenuSection({ section, collapsed, getBadgeCount }) {
  return (
    <div className="app-sidebar-section">
      {!collapsed && <div className="app-sidebar-section-title">{section.title}</div>}
      <nav className="app-sidebar-menu">
        {section.items.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            badgeCount={getBadgeCount(item)}
          />
        ))}
      </nav>
    </div>
  );
}

const AppSidebar = ({
  config,
  userDetails = { name: '', lab: '', designation: '' },
  userId,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  const reduxUserId = useSelector((state) => state.user.user?.id);
  const effectiveUserId = userId ?? reduxUserId ?? null;

  const notificationsConfig = config.notifications?.enabled ? config.notifications : null;
  const notificationRole = notificationsConfig?.role;
  const stateKey = notificationRole ? NOTIFICATION_STATE_KEYS[notificationRole] : null;

  useNotificationPolling({
    role: notificationRole || 'admin',
    userId: effectiveUserId,
  });

  const notifications = useSelector((state) =>
    stateKey ? state.notifications?.[stateKey]?.notifications || [] : []
  );
  const unreadCount = useSelector((state) =>
    stateKey ? state.notifications?.[stateKey]?.unreadCount || 0 : 0
  );

  useEffect(() => {
    if (!notificationDropdownOpen || unreadCount === 0 || !notificationRole) {
      return;
    }

    const unreadNotificationIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);

    if (unreadNotificationIds.length === 0) {
      return;
    }

    const markReadAction = MARK_READ_ACTIONS[notificationRole];
    if (markReadAction) {
      dispatch(markReadAction(unreadNotificationIds));
    }

    markNotificationsReadAPI(unreadNotificationIds).catch((error) => {
      console.error('Error marking notifications as read:', error);
    });
  }, [notificationDropdownOpen, unreadCount, notifications, dispatch, notificationRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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
    if (onLogout) {
      onLogout();
      return;
    }

    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/'))
      .catch((err) => {
        console.error('Logout failed:', err);
        navigate('/');
      });
  };

  const getBadgeCount = (item) => {
    if (!item.badgeFromState) {
      return 0;
    }
    return item.badgeFromState(reduxState) || 0;
  };

  const showUserBlock = config.showUserBlock !== false;

  return (
    <>
      {!collapsed && (
        <div
          className="app-sidebar-overlay d-lg-none"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar${collapsed ? ' collapsed' : ''}`}
        ref={sidebarRef}
        aria-label="Main navigation"
      >
        <div className="app-sidebar-header">
          <div className="d-flex align-items-center justify-content-between w-100">
            {!collapsed && (
              <div className="app-sidebar-brand">
                <button
                  type="button"
                  className="app-sidebar-logo"
                  onClick={() => navigate(config.homePath || '/')}
                  aria-label="Go to home"
                >
                  <FaHome />
                </button>
                <span>{config.brand}</span>
              </div>
            )}
            <button
              type="button"
              className="app-sidebar-toggle"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <FaBars /> : <FaTimes />}
            </button>
          </div>
        </div>

        {(showUserBlock || notificationsConfig) && (
          <div className="app-sidebar-top-meta">
            {showUserBlock && !collapsed && (
              <div className="app-sidebar-user">
                <div className="app-sidebar-user-avatar">
                  <UserAvatarIcon />
                </div>
                <div className="app-sidebar-user-info">
                  <div className="app-sidebar-user-name">{userDetails.name}</div>
                  <div className="app-sidebar-user-role">{userDetails.designation}</div>
                  <div className="app-sidebar-user-lab">{formatLabDisplay(userDetails.lab)}</div>
                </div>
              </div>
            )}

            {notificationsConfig && (
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                isOpen={notificationDropdownOpen}
                onToggle={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                collapsed={collapsed}
                timeFormat={notificationsConfig.timeFormat || 'full'}
                inset={notificationsConfig.inset}
              />
            )}
          </div>
        )}

        <div className="app-sidebar-menu-wrapper">
          {config.sections.map((section, index) => (
            <MenuSection
              key={section.title || index}
              section={section}
              collapsed={collapsed}
              getBadgeCount={getBadgeCount}
            />
          ))}

          {config.accountSection && (
            <MenuSection
              section={config.accountSection}
              collapsed={collapsed}
              getBadgeCount={getBadgeCount}
            />
          )}
        </div>

        <div className="app-sidebar-footer">
          <button
            type="button"
            className="app-sidebar-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
