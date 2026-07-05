import { FaChartBar, FaBell, FaSyncAlt, FaRedo } from 'react-icons/fa';

export const managerMenuConfig = {
  brand: 'Manager',
  homePath: '/',
  showUserBlock: true,
  notifications: {
    enabled: true,
    role: 'manager',
    timeFormat: 'full',
    inset: true,
  },
  sections: [
    {
      title: 'Navigation',
      items: [
        { path: '/dashboard', icon: FaChartBar, label: 'Dashboard', iconColor: '#3b82f6' },
        {
          path: '/notification',
          icon: FaBell,
          label: 'Request Notification',
          iconColor: '#f59e0b',
          badgeFromState: (state) => state.notifications?.manager?.pendingIssues?.length || 0,
        },
        {
          path: '/returnNoti',
          icon: FaSyncAlt,
          label: 'Return Notification',
          iconColor: '#06b6d4',
          badgeFromState: (state) => state.notifications?.manager?.pendingReturns?.length || 0,
        },
        { path: '/change_password', icon: FaRedo, label: 'Change Password', iconColor: '#ef4444' },
      ],
    },
  ],
};
