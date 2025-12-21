import { createSlice } from '@reduxjs/toolkit';
import { logoutUser } from './userSlice';

const initialState = {
  manager: {
    pendingReturns: [], // Item return requests pending approval
    pendingIssues: [],  // Issue requests pending approval
    notifications: [],  // All notifications from /app-notifications/ API
    unreadCount: 0,     // Count of unread notifications (is_read === false)
    lastUpdated: null,  // Timestamp of last successful poll
  },
  labAssistant: {
    notifications: [],  // All notifications from /app-notifications/ API
    unreadCount: 0,     // Count of unread notifications (is_read === false)
    lastUpdated: null,  // Timestamp of last successful poll
  },
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Set pending item return requests for manager
    setManagerPendingReturns: (state, action) => {
      state.manager.pendingReturns = Array.isArray(action.payload) ? action.payload : [];
      state.manager.lastUpdated = new Date().toISOString();
    },
    // Set pending issue requests for manager
    setManagerPendingIssues: (state, action) => {
      state.manager.pendingIssues = Array.isArray(action.payload) ? action.payload : [];
      state.manager.lastUpdated = new Date().toISOString();
    },
    // Set all notifications from /app-notifications/ API
    setManagerNotifications: (state, action) => {
      const notifications = Array.isArray(action.payload) ? action.payload : [];
      state.manager.notifications = notifications;
      // Compute unreadCount from notifications where is_read === false
      state.manager.unreadCount = notifications.filter(n => !n.is_read).length;
      state.manager.lastUpdated = new Date().toISOString();
    },
    // Mark notifications as read locally (optimistic update)
    markNotificationsRead: (state, action) => {
      const notificationIds = Array.isArray(action.payload) ? action.payload : [];
      state.manager.notifications = state.manager.notifications.map(notification => {
        if (notificationIds.includes(notification.id)) {
          return { ...notification, is_read: true };
        }
        return notification;
      });
      // Recompute unreadCount
      state.manager.unreadCount = state.manager.notifications.filter(n => !n.is_read).length;
    },
    // Clear all manager notifications (e.g., on logout)
    clearManagerNotifications: (state) => {
      state.manager.pendingReturns = [];
      state.manager.pendingIssues = [];
      state.manager.notifications = [];
      state.manager.unreadCount = 0;
      state.manager.lastUpdated = null;
    },
    // Set all notifications for lab assistant from /app-notifications/ API
    setLabAssistantNotifications: (state, action) => {
      const notifications = Array.isArray(action.payload) ? action.payload : [];
      state.labAssistant.notifications = notifications;
      // Compute unreadCount from notifications where is_read === false
      state.labAssistant.unreadCount = notifications.filter(n => !n.is_read).length;
      state.labAssistant.lastUpdated = new Date().toISOString();
    },
    // Mark notifications as read locally for lab assistant (optimistic update)
    markLabAssistantNotificationsRead: (state, action) => {
      const notificationIds = Array.isArray(action.payload) ? action.payload : [];
      state.labAssistant.notifications = state.labAssistant.notifications.map(notification => {
        if (notificationIds.includes(notification.id)) {
          return { ...notification, is_read: true };
        }
        return notification;
      });
      // Recompute unreadCount
      state.labAssistant.unreadCount = state.labAssistant.notifications.filter(n => !n.is_read).length;
    },
    // Clear all lab assistant notifications (e.g., on logout)
    clearLabAssistantNotifications: (state) => {
      state.labAssistant.notifications = [];
      state.labAssistant.unreadCount = 0;
      state.labAssistant.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Clear notifications when user logs out
      .addCase(logoutUser.fulfilled, (state) => {
        state.manager.pendingReturns = [];
        state.manager.pendingIssues = [];
        state.manager.notifications = [];
        state.manager.unreadCount = 0;
        state.manager.lastUpdated = null;
        state.labAssistant.notifications = [];
        state.labAssistant.unreadCount = 0;
        state.labAssistant.lastUpdated = null;
      });
  },
});

export const {
  setManagerPendingReturns,
  setManagerPendingIssues,
  setManagerNotifications,
  markNotificationsRead,
  clearManagerNotifications,
  setLabAssistantNotifications,
  markLabAssistantNotificationsRead,
  clearLabAssistantNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

