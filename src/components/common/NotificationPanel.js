import React from 'react';
import { FaBell } from 'react-icons/fa';
import '../../styles/components/notification-panel.css';

export function formatNotificationTime(dateString, format = 'full') {
  if (!dateString) {
    return format === 'relative' ? 'Unknown time' : 'Time not available';
  }

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return format === 'relative' ? 'Invalid date' : 'Time not available';
    }

    if (format === 'relative') {
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error parsing notification date:', dateString, error);
    return format === 'relative' ? 'Invalid date' : 'Time not available';
  }
}

const NotificationPanel = ({
  notifications = [],
  unreadCount = 0,
  isOpen = false,
  onToggle,
  collapsed = false,
  timeFormat = 'full',
  inset = false,
}) => {
  const wrapClass = [
    'notification-panel-wrap',
    inset ? 'notification-panel-wrap--inset' : '',
    !inset ? 'notification-panel-wrap--compact' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const dropdownClass = [
    'notification-panel-dropdown',
    collapsed
      ? 'notification-panel-dropdown--collapsed'
      : 'notification-panel-dropdown--expanded',
  ].join(' ');

  return (
    <div className={wrapClass}>
      <button
        type="button"
        className={`notification-panel-toggle ${isOpen ? 'is-open' : ''}`}
        onClick={onToggle}
        title="Notifications"
      >
        <div className="notification-panel-toggle-inner">
          <FaBell />
          {!collapsed && (
            <span className="notification-panel-toggle-label">Notifications</span>
          )}
        </div>
        {unreadCount > 0 && (
          <span className="notification-panel-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={dropdownClass}>
          <div className="notification-panel-dropdown-header">
            Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
          </div>
          {notifications.length === 0 ? (
            <div className="notification-panel-empty">No notifications</div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-panel-item ${
                    notification.is_read ? 'is-read' : 'is-unread'
                  }`}
                >
                  <div className="notification-panel-item-row">
                    {!notification.is_read && (
                      <div className="notification-panel-unread-dot" />
                    )}
                    <div className="notification-panel-item-body">
                      <div className="notification-panel-message">
                        {notification.message}
                      </div>
                      <div className="notification-panel-meta">
                        <span>{notification.notification_type}</span>
                        <span>•</span>
                        <span>
                          {formatNotificationTime(
                            notification.created_at,
                            timeFormat
                          )}
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
  );
};

export default NotificationPanel;
