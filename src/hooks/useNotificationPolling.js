import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getItemReturnsForManager, getIssueItems, getUserNotifications } from '../services/AppinfoService';
import {
  setManagerPendingReturns,
  setManagerPendingIssues,
  setManagerNotifications,
  setLabAssistantNotifications,
  setResearcherPendingConfirmations,
  setResearcherNotifications,
} from '../store/slices/notificationSlice';
import { getIssueItemsByStatus } from '../services/AppinfoService';

/**
 * Reusable hook for polling notification APIs based on user role
 * 
 * @param {Object} params - Polling parameters
 * @param {string} params.role - User role ('manager', 'lab_assistant', 'researcher')
 * @param {string|number} params.userId - User ID (required for manager role)
 * @param {number} params.intervalMs - Polling interval in milliseconds (default: 25000)
 * 
 * @example
 * // In ManagerNavigation component:
 * useNotificationPolling({ role: 'manager', userId: userId });
 */
const useNotificationPolling = ({ role, userId, intervalMs = 3000 }) => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  // Track previous unreadCount to detect new notifications
  // null = not initialized yet (first poll), number = previous count
  const prevUnreadCountRef = useRef(null);

  useEffect(() => {
    // Start polling for manager, lab_assistant, or researcher
    // For researcher, userId is optional (can use username from Redux)
    if (role !== 'manager' && role !== 'lab_assistant' && role !== 'researcher') {
      console.log(`🔄 [POLLING] Skipping polling - role "${role}" not supported`);
      return;
    }
    
    // Manager and lab_assistant require userId
    if ((role === 'manager' || role === 'lab_assistant') && !userId) {
      console.log('🔄 [POLLING] Skipping polling - userId not available');
      return;
    }

    // Clean up any existing interval before starting a new one
    if (intervalRef.current) {
      console.log('🔄 [POLLING] Cleaning up existing polling interval');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset previous unread count when starting new polling session
    prevUnreadCountRef.current = null;

    console.log(`🔄 [POLLING] Starting notification polling for ${role}`);
    console.log(`🔄 [POLLING] User ID: ${userId}`);
    console.log(`🔄 [POLLING] Polling interval: ${intervalMs}ms (${intervalMs / 1000}s)`);

    // Poll function that fetches notifications and dispatches to Redux
    const pollNotifications = async () => {
      try {
        console.log('🔄 [POLLING] Polling notifications...');
        
        // Poll unified notifications API
        console.log('🔄 [POLLING] Calling getUserNotifications...');
        const notifications = await getUserNotifications();
        console.log(`🔄 [POLLING] Notifications: ${notifications?.length || 0} total`);
        const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
        console.log(`🔄 [POLLING] Unread: ${unreadCount}`);
        
        // Check for new notifications (only after first successful poll)
        const prevUnreadCount = prevUnreadCountRef.current;
        
        if (prevUnreadCount !== null && unreadCount > prevUnreadCount) {
          // New notifications arrived - show toast
          const newCount = unreadCount - prevUnreadCount;
          const message = newCount === 1 
            ? 'You have a new notification' 
            : `You have ${newCount} new notifications`;
          
          toast.success(message, {
            icon: '🔔',
            duration: 4000,
          });
          
          console.log(`🔔 [TOAST] Showing notification: ${message}`);
        }
        
        // Initialize or update previous unread count
        // Set to current count after first successful poll (prevents toast on initial load)
        if (prevUnreadCountRef.current === null) {
          console.log(`🔄 [POLLING] Initializing previous unread count: ${unreadCount}`);
        }
        prevUnreadCountRef.current = unreadCount;
        
        // Dispatch to Redux based on role
        if (role === 'manager') {
          dispatch(setManagerNotifications(notifications || []));
          
          // Also poll legacy endpoints for backward compatibility
          console.log('🔄 [POLLING] Calling getItemReturnsForManager...');
          const returnNotifications = await getItemReturnsForManager(userId);
          console.log(`🔄 [POLLING] Item returns: ${returnNotifications?.length || 0} pending`);
          dispatch(setManagerPendingReturns(returnNotifications || []));
          
          console.log('🔄 [POLLING] Calling getIssueItems...');
          const issueNotifications = await getIssueItems();
          console.log(`🔄 [POLLING] Issue requests: ${issueNotifications?.length || 0} pending`);
          dispatch(setManagerPendingIssues(issueNotifications || []));
        } else if (role === 'lab_assistant') {
          dispatch(setLabAssistantNotifications(notifications || []));
        } else if (role === 'researcher') {
          dispatch(setResearcherNotifications(notifications || []));
          
          // Poll for RSR-CONFIRM items (pending researcher confirmation)
          console.log('🔄 [POLLING] Calling getIssueItemsByStatus for RSR-CONFIRM...');
          const confirmItems = await getIssueItemsByStatus('RSR-CONFIRM');
          console.log(`🔄 [POLLING] Pending confirmations: ${confirmItems?.length || 0}`);
          dispatch(setResearcherPendingConfirmations(confirmItems || []));
        }
        
        console.log('✅ [POLLING] Polling cycle completed successfully - data dispatched to Redux');
      } catch (error) {
        console.error('❌ [POLLING] Error during polling cycle:', error);
        // Continue polling even if one cycle fails
      }
    };

    // Initial fetch (don't wait for first interval)
    pollNotifications();

    // Set up interval for subsequent polls (20-30 seconds as specified)
    intervalRef.current = setInterval(pollNotifications, intervalMs);
    console.log(`🔄 [POLLING] Polling interval set to ${intervalMs}ms`);

    // Cleanup function - runs on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        console.log('🔄 [POLLING] Stopping notification polling');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [role, userId, intervalMs, dispatch]);

  // Hook doesn't need to return anything for now
  // Can be extended to return polling status if needed
};

export default useNotificationPolling;

